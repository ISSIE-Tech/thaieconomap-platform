import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateAnnouncementDto } from './create-announcement.dto';

export class UpdateAnnouncementDto extends PartialType(
  OmitType(CreateAnnouncementDto, ['startAt', 'endAt'] as const),
) {}
