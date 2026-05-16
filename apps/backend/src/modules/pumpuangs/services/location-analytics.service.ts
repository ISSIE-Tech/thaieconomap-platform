import { randomUUID } from 'node:crypto';
import * as https from 'node:https';

import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

import { PumpuangLocationDto } from '../dto';

const MAX_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 200;
const REQUEST_TIMEOUT_MS = 5000;
const SHUTDOWN_DRAIN_TIMEOUT_MS = 10_000;

type ForwardOutcome = 'sent' | 'timeout' | 'http_error' | 'network_error';

interface CategorizedError {
  outcome: Exclude<ForwardOutcome, 'sent'>;
  status?: number;
  code?: string;
  message: string;
}

@Injectable()
export class LocationAnalyticsService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(LocationAnalyticsService.name);
  private readonly webhookUrl: string;
  private readonly apiKey: string;
  private readonly enabled: boolean;

  // Reuse one keep-alive agent so we don't pay TLS+TCP handshake per location ping.
  // Repeated handshakes under burst load were a likely source of intermittent ECONNRESET.
  private readonly httpsAgent = new https.Agent({
    keepAlive: true,
    rejectUnauthorized: false,
  });

  // Track in-flight forwards so we can drain them on shutdown. Without this,
  // pod restarts / redeploys silently drop any unsent location events.
  private readonly inFlight = new Set<Promise<void>>();

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.webhookUrl = this.configService.get<string>('ANALYTICS_WEBHOOK_URL');
    this.apiKey = this.configService.get<string>('ANALYTICS_WEBHOOK_API_KEY');
    this.enabled = !!this.webhookUrl && !!this.apiKey;
  }

  onModuleInit() {
    if (!this.enabled) {
      this.logger.log(
        'Analytics forwarding is disabled (ANALYTICS_WEBHOOK_URL or ANALYTICS_WEBHOOK_API_KEY not set)',
      );
    } else {
      this.logger.log(`Analytics forwarding enabled → ${this.webhookUrl}`);
    }
  }

  async onApplicationShutdown(signal?: string): Promise<void> {
    if (!this.inFlight.size) {
      return;
    }

    const pendingAtStart = this.inFlight.size;

    this.logger.log(
      `[analytics] shutdown drain begin signal=${signal ?? 'unknown'} pending=${pendingAtStart}`,
    );

    const drained = Promise.allSettled(Array.from(this.inFlight));
    const timeout = new Promise<'timeout'>(resolve =>
      setTimeout(() => resolve('timeout'), SHUTDOWN_DRAIN_TIMEOUT_MS).unref(),
    );

    const result = await Promise.race([drained, timeout]);

    if (result === 'timeout') {
      this.logger.error(
        `[analytics] shutdown drain timed out after ${SHUTDOWN_DRAIN_TIMEOUT_MS}ms remaining=${this.inFlight.size} startPending=${pendingAtStart}`,
      );
    } else {
      this.logger.log(`[analytics] shutdown drain complete drained=${pendingAtStart}`);
    }
  }

  forwardLocation(pumpuangId: string, locationDto: PumpuangLocationDto): void {
    if (!this.enabled) {
      return;
    }

    const eventId = randomUUID();
    const task = this.send(eventId, pumpuangId, locationDto);
    this.inFlight.add(task);
    task.finally(() => this.inFlight.delete(task));
  }

  // Location telemetry is idempotent: same eventId can be safely retried —
  // the receiver can dedupe by eventId, or apply last-write-wins by sentAt.
  private async send(
    eventId: string,
    pumpuangId: string,
    locationDto: PumpuangLocationDto,
  ): Promise<void> {
    const payload = {
      eventId,
      service: 'pumm-puang',
      trackerId: pumpuangId,
      sentAt: new Date().toISOString(),
      location: locationDto.location,
    };
    const url = `${this.webhookUrl}/api/webhook/location`;

    this.logger.log(
      `[analytics] forward start eventId=${eventId} pumpuangId=${pumpuangId} url=${url}`,
    );

    const startedAt = Date.now();

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const attemptStartedAt = Date.now();
      try {
        const response = await firstValueFrom(
          this.httpService.post(url, payload, {
            headers: {
              'Content-Type': 'application/json',
              'X-Api-Key': this.apiKey,
              'X-Event-Id': eventId,
            },
            timeout: REQUEST_TIMEOUT_MS,
            httpsAgent: this.httpsAgent,
          }),
        );

        this.logger.log(
          `[analytics] forward end outcome=sent eventId=${eventId} pumpuangId=${pumpuangId} ` +
            `attempt=${attempt} status=${response.status} ` +
            `attemptLatencyMs=${Date.now() - attemptStartedAt} ` +
            `totalLatencyMs=${Date.now() - startedAt}`,
        );

        return;
      } catch (err) {
        const { outcome, status, code, message } = categorizeError(err);
        // Retry on transient failures only: network, timeout, 5xx. Skip 4xx since
        // those won't change on a re-send and would just waste time + add noise.
        const retryable =
          outcome === 'timeout' ||
          outcome === 'network_error' ||
          (outcome === 'http_error' && status >= 500 && status < 600);
        const willRetry = retryable && attempt < MAX_ATTEMPTS;

        this.logger.error(
          `[analytics] forward attempt fail outcome=${outcome} eventId=${eventId} ` +
            `pumpuangId=${pumpuangId} attempt=${attempt}/${MAX_ATTEMPTS} ` +
            `status=${status ?? '-'} code=${code ?? '-'} ` +
            `attemptLatencyMs=${Date.now() - attemptStartedAt} ` +
            `totalLatencyMs=${Date.now() - startedAt} willRetry=${willRetry} msg=${message}`,
        );

        if (!willRetry) {
          this.logger.error(
            `[analytics] forward end outcome=${outcome} eventId=${eventId} ` +
              `pumpuangId=${pumpuangId} attempts=${attempt} ` +
              `totalLatencyMs=${Date.now() - startedAt} dropped=true`,
          );

          return;
        }

        const backoffMs = BASE_BACKOFF_MS * 2 ** (attempt - 1);
        await sleep(backoffMs);
      }
    }
  }
}

function categorizeError(err: unknown): CategorizedError {
  const ax = err as AxiosError | undefined;
  const message = ax?.message ?? String(err);

  if (ax?.code === 'ECONNABORTED' || /timeout/i.test(message)) {
    return { outcome: 'timeout', code: ax?.code, message };
  }

  if (ax?.response) {
    return {
      outcome: 'http_error',
      status: ax.response.status,
      code: ax.code,
      message,
    };
  }

  return { outcome: 'network_error', code: ax?.code, message };
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
