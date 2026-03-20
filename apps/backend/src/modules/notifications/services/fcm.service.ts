import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as admin from 'firebase-admin';

import { GLOBAL_CONFIG } from '../../../shared/constants';
import { DeviceTokenRepository } from '../repositories';

@Injectable()
export class FcmService implements OnModuleInit {
  private readonly logger = new Logger(FcmService.name);
  private isInitialized = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly deviceTokenRepository: DeviceTokenRepository,
  ) {}

  onModuleInit() {
    const projectId = this.configService.get<string>(GLOBAL_CONFIG.FCM_PROJECT_ID);
    const clientEmail = this.configService.get<string>(GLOBAL_CONFIG.FCM_CLIENT_EMAIL);
    const privateKey = this.configService.get<string>(GLOBAL_CONFIG.FCM_PRIVATE_KEY);

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn('FCM credentials not configured — push notifications disabled');

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
    this.logger.log('Firebase Admin SDK initialized successfully');
  }

  async sendToDevice(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    if (!this.isInitialized) return;

    try {
      const result = await admin.messaging().send({
        token,
        notification: { title, body },
        ...(data && { data }),
      });

      this.logger.debug(`FCM send result: ${result}`);
    } catch (error) {
      await this.handleSendError(error, [token]);
    }
  }

  async sendToMultiple(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    if (!this.isInitialized) return;

    if (tokens.length === 0) {
      this.logger.debug('No tokens to send to — skipping');

      return;
    }

    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title, body },
        ...(data && { data }),
      });

      this.logger.debug(
        `FCM multicast: ${response.successCount} success, ${response.failureCount} failures`,
      );

      const invalidTokens: string[] = [];

      response.responses.forEach((resp, idx) => {
        if (resp.error && resp.error.code === 'messaging/registration-token-not-registered') {
          invalidTokens.push(tokens[idx]);
        }
      });

      if (invalidTokens.length > 0) {
        this.logger.warn(`Removing ${invalidTokens.length} invalid FCM tokens`);
        await this.deviceTokenRepository.removeTokensByValues(invalidTokens);
      }
    } catch (error) {
      this.logger.error(`FCM multicast error: ${error.message}`);
    }
  }

  async sendToTopic(
    topic: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    if (!this.isInitialized) return;

    try {
      const result = await admin.messaging().send({
        topic,
        notification: { title, body },
        ...(data && { data }),
      });

      this.logger.debug(`FCM topic send result: ${result}`);
    } catch (error) {
      this.logger.error(`FCM topic send error: ${error.message}`);
    }
  }

  private async handleSendError(error: { code?: string; message?: string }, tokens: string[]): Promise<void> {
    if (error.code === 'messaging/registration-token-not-registered') {
      this.logger.warn(`Invalid FCM token detected, removing: ${tokens}`);
      await this.deviceTokenRepository.removeTokensByValues(tokens);
    } else {
      this.logger.error(`FCM send error: ${error.message}`);
    }
  }
}
