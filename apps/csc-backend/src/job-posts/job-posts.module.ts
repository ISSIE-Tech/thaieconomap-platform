import { Module } from '@nestjs/common';
import { JobPostsService } from './services/job-posts.service';
import { JobPostsController } from './controllers/job-posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobPost, JobPostSchema } from './schemas/job-post.schema';
import { JobCategory, JobCategorySchema } from './schemas/job-category.schema';
import {
  Submission,
  SubmissionSchema,
} from 'src/submissions/schemas/submission.schema';
import { District, DistrictSchema } from 'src/districts/district.schema';
import { PendingJobPostsController } from './controllers/pending-job-posts.controller';
import { PendingJobPostsService } from './services/pending-job-post.service';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { SubmissionsModule } from 'src/submissions/submissions.module';
import { WageUnit, WageUnitSchema } from './schemas/wage-unit.schema';
import { DeletedJobPostsService } from './services/deleted-job-posts.service';
import {
  OnCloseJobPost,
  OnCloseJobPostSchema,
} from './schemas/on-close-job-post.schema';
import { ChangeStreamService } from './services/change-stream.service';

@Module({
  imports: [
    MinioClientModule,
    MongooseModule.forFeature([
      { name: JobPost.name, schema: JobPostSchema },
      { name: JobCategory.name, schema: JobCategorySchema },
      { name: Submission.name, schema: SubmissionSchema },
      { name: District.name, schema: DistrictSchema },
      { name: WageUnit.name, schema: WageUnitSchema },
      { name: OnCloseJobPost.name, schema: OnCloseJobPostSchema },
    ]),
    SubmissionsModule,
  ],
  providers: [
    PendingJobPostsService,
    JobPostsService,
    DeletedJobPostsService,
    ChangeStreamService,
  ],
  controllers: [PendingJobPostsController, JobPostsController],
  exports: [
    PendingJobPostsService,
    JobPostsService,
    DeletedJobPostsService,
    ChangeStreamService,
  ],
})
export class JobPostsModule {}
