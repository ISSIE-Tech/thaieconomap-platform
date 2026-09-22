import { PartialType } from '@nestjs/swagger';
import { CreateJobPostDto } from './create-job-post';

export class UpdateJobPostDto extends PartialType(CreateJobPostDto) {}
