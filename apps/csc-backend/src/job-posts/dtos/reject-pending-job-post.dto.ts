import { IsString } from 'class-validator';

export class RejectPendingJobPostDto {
  @IsString()
  rejectMessage: string;
}
