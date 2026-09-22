import { Module } from '@nestjs/common';
import { BackofficeController } from './backoffice.controller';
import { BackofficeJobPostsController } from './controllers/backoffice-job-posts.controller';
import { BackofficeUsersController } from './controllers/backoffice-users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { JobPostsModule } from 'src/job-posts/job-posts.module';
import { BackofficePendingJobPostsController } from './controllers/backoffice-pending-job-posts.controller';
import { BackofficeDeletedJobPostsController } from './controllers/backoffice-deleted-job-posts.controller';

@Module({
  imports: [AuthModule, UsersModule, JobPostsModule],
  controllers: [
    BackofficeController,
    BackofficeJobPostsController,
    BackofficePendingJobPostsController,
    BackofficeDeletedJobPostsController,
    BackofficeUsersController,
  ],
})
export class BackofficeModule {}
