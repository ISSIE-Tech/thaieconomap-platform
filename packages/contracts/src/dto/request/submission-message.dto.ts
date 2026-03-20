import { IsString, MaxLength } from 'class-validator';

import { CONFIG } from '../../constants';

export class SubmissionMessageDto {
  @IsString()
  @MaxLength(CONFIG.MAX_TEXT_AREA_LENGTH)
  submissionMessage: string;
}
