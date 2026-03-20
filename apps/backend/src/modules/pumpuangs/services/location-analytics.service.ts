import * as https from 'https';

import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';

import { PumpuangLocationDto } from '../dto';

@Injectable()
export class LocationAnalyticsService implements OnModuleInit {
  private readonly logger = new Logger(LocationAnalyticsService.name);
  private readonly webhookUrl: string;
  private readonly apiKey: string;
  private readonly enabled: boolean;

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

  forwardLocation(pumpuangId: string, locationDto: PumpuangLocationDto): void {
    if (!this.enabled) {
      return;
    }

    const payload = {
      service: 'pumm-puang',
      trackerId: pumpuangId,
      location: locationDto.location,
    };

    const url = `${this.webhookUrl}/api/webhook/location`;
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    firstValueFrom(
      this.httpService.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': this.apiKey,
        },
        timeout: 5000,
        httpsAgent,
      }),
    ).catch(error => {
      this.logger.warn(`Failed to forward location for pumpuang ${pumpuangId}: ${error.message}`);
    });
  }
}
