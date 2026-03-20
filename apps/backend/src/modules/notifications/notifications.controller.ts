import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SendNotificationDto, SendTopicNotificationDto } from './dto';
import { NotificationService } from './services';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

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
}
