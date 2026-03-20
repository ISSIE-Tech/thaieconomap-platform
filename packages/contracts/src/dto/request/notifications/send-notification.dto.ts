import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class SendNotificationDto {
  @IsNotEmpty() @IsString() pumpuangId: string;
  @IsNotEmpty() @IsString() title: string;
  @IsNotEmpty() @IsString() body: string;
  @IsOptional() @IsObject() data?: Record<string, string>;
}

export class SendTopicNotificationDto {
  @IsNotEmpty() @IsString() topic: string;
  @IsNotEmpty() @IsString() title: string;
  @IsNotEmpty() @IsString() body: string;
  @IsOptional() @IsObject() data?: Record<string, string>;
}

export class UpdateFcmTokenDto {
  @IsNotEmpty() @IsString() token: string;
  @IsOptional() @IsString() platform?: string;
}

export class RemoveFcmTokenDto {
  @IsNotEmpty() @IsString() token: string;
}
