import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserRole } from '@thaieconomap/contracts';

import { Roles } from '../../common/decorators/roles.decarotor';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  GetNotificationLogsDto,
  GetTokenCountsDto,
  SendNotificationDto,
  SendTopicNotificationDto,
  TestSendDto,
} from './dto';
import { FcmNotificationLogService, NotificationService } from './services';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly logService: FcmNotificationLogService,
  ) {}

  @ApiOperation({ summary: 'Send push notification to a pumpuang by ID' })
  @ApiOkResponse({ description: 'Notification sent' })
  @Post('send')
  async sendNotification(@Body() dto: SendNotificationDto): Promise<void> {
    await this.notificationService.sendToPumpuang(dto.pumpuangId, dto.title, dto.body, dto.data);
  }

  @ApiOperation({ summary: 'Send push notification to an FCM topic' })
  @ApiOkResponse({ description: 'Topic notification sent' })
  @Post('send-topic')
  async sendTopicNotification(@Body() dto: SendTopicNotificationDto): Promise<void> {
    await this.notificationService.sendToTopic(dto.topic, dto.title, dto.body, dto.data);
  }

  @ApiOperation({ summary: 'Get paginated FCM notification logs' })
  @ApiOkResponse({ description: 'Notification logs retrieved' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DEVELOPER)
  @Get('logs')
  async getLogs(@Query() dto: GetNotificationLogsDto) {
    const page = parseInt(dto.page ?? '1', 10);
    const limit = parseInt(dto.limit ?? '20', 10);

    return this.logService.findLogs(
      { status: dto.status, sendTo: dto.sendTo, from: dto.from, to: dto.to },
      page,
      limit,
    );
  }

  @ApiOperation({ summary: 'Get FCM token counts for pumpuang IDs' })
  @ApiOkResponse({ description: 'Token counts retrieved' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DEVELOPER)
  @Post('token-counts')
  async getTokenCounts(@Body() dto: GetTokenCountsDto) {
    return this.logService.getTokenCounts(dto.ids);
  }

  @ApiOperation({ summary: 'Send test notification to a pumpuang' })
  @ApiOkResponse({ description: 'Test notification sent' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DEVELOPER)
  @Post('test-send')
  async testSend(@Body() dto: TestSendDto) {
    await this.notificationService.sendToPumpuang(
      dto.pumpuangId,
      'Test Notification',
      'This is a test notification from ThaiEconoMap Admin',
      undefined,
      'manual test',
    );

    return { message: 'Test notification sent' };
  }
}
