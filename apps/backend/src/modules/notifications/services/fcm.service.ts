import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as admin from 'firebase-admin';

import { GLOBAL_CONFIG } from '../../../shared/constants';
import { prettyObjectString } from '../../../shared/utils';
import { DeviceTokenRepository, FcmNotificationLogRepository } from '../repositories';
import { FcmNotificationStatus } from '../schemas';

@Injectable()
export class FcmService implements OnModuleInit {
  private readonly logger = new Logger(FcmService.name);
  private isInitialized = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly deviceTokenRepository: DeviceTokenRepository,
    private readonly logRepository: FcmNotificationLogRepository,
  ) {}

  onModuleInit() {
    const projectId = this.configService.get<string>(GLOBAL_CONFIG.FCM_PROJECT_ID);
    const clientEmail = this.configService.get<string>(GLOBAL_CONFIG.FCM_CLIENT_EMAIL);
    const privateKey = this.configService.get<string>(GLOBAL_CONFIG.FCM_PRIVATE_KEY);

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn(`{${FcmService.name}-${this.onModuleInit.name}} FCM credentials not configured — push notifications disabled`);

      return;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });

    this.isInitialized = true;
    this.logger.log(`{${FcmService.name}-${this.onModuleInit.name}} Firebase Admin SDK initialized successfully`);
  }

  async sendToDevice(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
    reason = 'notification',
    pumpuangName?: string | null,
  ): Promise<void> {
    const ctx = `${FcmService.name}-${this.sendToDevice.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({ token: `${token.substring(0, 12)}...`, title, body, reason })}`,
    );

    if (!this.isInitialized) {
      this.logger.warn(`{${ctx}} FCM not initialized — skipping`);
      return;
    }

    try {
      const result = await admin.messaging().send({
        token,
        notification: { title, body },
        ...(data && { data }),
      });

      this.logger.log(`{${ctx}} (success) messageId: ${result}`);
      await this.logRepository.create({ sendTo: token, pumpuangName, status: FcmNotificationStatus.SUCCESS, reason });
    } catch (error) {
      this.logger.error(`{${ctx}} (failed)\
      \n[error] ${prettyObjectString({ code: error.code, message: error.message })}`);
      await this.logRepository.create({ sendTo: token, pumpuangName, status: FcmNotificationStatus.FAILURE, reason, errorMessage: error.message });
      await this.handleSendError(error, [token]);
    }
  }

  async sendToMultiple(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
    reason = 'notification',
    pumpuangName?: string | null,
  ): Promise<void> {
    const ctx = `${FcmService.name}-${this.sendToMultiple.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({ tokenCount: tokens.length, title, body, reason })}`,
    );

    if (!this.isInitialized) {
      this.logger.warn(`{${ctx}} FCM not initialized — skipping`);
      return;
    }

    if (tokens.length === 0) {
      this.logger.debug(`{${ctx}} no tokens to send to — skipping`);

      return;
    }

    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title, body },
        ...(data && { data }),
      });

      this.logger.log(
        `{${ctx}} (result) ${prettyObjectString({
          total: tokens.length,
          successCount: response.successCount,
          failureCount: response.failureCount,
        })}`,
      );

      const invalidTokens: string[] = [];
      const logPromises: Promise<unknown>[] = [];

      response.responses.forEach((resp, idx) => {
        if (resp.success) {
          logPromises.push(
            this.logRepository.create({ sendTo: tokens[idx], pumpuangName, status: FcmNotificationStatus.SUCCESS, reason }),
          );
        } else {
          this.logger.verbose(
            `{${ctx}} (device failed) ${prettyObjectString({
              token: `${tokens[idx].substring(0, 12)}...`,
              error: resp.error?.message,
              code: resp.error?.code,
            })}`,
          );
          logPromises.push(
            this.logRepository.create({ sendTo: tokens[idx], pumpuangName, status: FcmNotificationStatus.FAILURE, reason, errorMessage: resp.error?.message ?? 'Unknown error' }),
          );
          if (resp.error?.code === 'messaging/registration-token-not-registered') {
            invalidTokens.push(tokens[idx]);
          }
        }
      });

      await Promise.all(logPromises);

      if (invalidTokens.length > 0) {
        this.logger.warn(`{${ctx}} removing ${invalidTokens.length} invalid FCM tokens`);
        await this.deviceTokenRepository.removeTokensByValues(invalidTokens);
      }
    } catch (error) {
      this.logger.error(`{${ctx}} (failed)\
      \n[error] ${prettyObjectString({ message: error.message })}`);
    }
  }

  async sendToTopic(
    topic: string,
    title: string,
    body: string,
    data?: Record<string, string>,
    reason = 'topic notification',
  ): Promise<void> {
    const ctx = `${FcmService.name}-${this.sendToTopic.name}`;

    this.logger.debug(
      `{${ctx}} (called)\
      \n[param] ${prettyObjectString({ topic, title, body, reason })}`,
    );

    if (!this.isInitialized) {
      this.logger.warn(`{${ctx}} FCM not initialized — skipping`);
      return;
    }

    try {
      const result = await admin.messaging().send({
        topic,
        notification: { title, body },
        ...(data && { data }),
      });

      this.logger.log(`{${ctx}} (success) messageId: ${result}`);
      await this.logRepository.create({ sendTo: `topic:${topic}`, status: FcmNotificationStatus.SUCCESS, reason });
    } catch (error) {
      this.logger.error(`{${ctx}} (failed)\
      \n[error] ${prettyObjectString({ code: error.code, message: error.message })}`);
      await this.logRepository.create({ sendTo: `topic:${topic}`, status: FcmNotificationStatus.FAILURE, reason, errorMessage: error.message });
    }
  }

  private async handleSendError(error: { code?: string; message?: string }, tokens: string[]): Promise<void> {
    const ctx = `${FcmService.name}-${this.handleSendError.name}`;

    if (error.code === 'messaging/registration-token-not-registered') {
      this.logger.warn(`{${ctx}} invalid FCM token detected, removing ${tokens.length} token(s)`);
      await this.deviceTokenRepository.removeTokensByValues(tokens);
    }
  }
}
