import { IsString } from 'class-validator';

export class ApplyJobDto {
  @IsString()
  additionalInformation: string;
}
