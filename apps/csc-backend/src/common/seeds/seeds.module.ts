import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { AuthModule } from 'src/auth/auth.module';
import { DistrictsModule } from 'src/districts/districts.module';
import { DistrictsSeed } from 'src/districts/seeds/districts.seed';
import { JobPostsModule } from 'src/job-posts/job-posts.module';
import { JobPostsSeed } from 'src/job-posts/seeds/job-posts.seed';
import { UsersSeed } from 'src/users/seeds/users.seed';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    CommandModule,
    UsersModule,
    JobPostsModule,
    AuthModule,
    DistrictsModule,
  ],
  providers: [UsersSeed, JobPostsSeed, DistrictsSeed],
  exports: [UsersSeed, JobPostsSeed, DistrictsSeed],
})
export class SeedsModule {}
