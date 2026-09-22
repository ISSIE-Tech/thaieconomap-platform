import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ObjectId } from 'src/common/decorators/object-id.decorator';
import { ExcludeRoles, Roles } from 'src/common/decorators/roles.decorator';
import JwtAccessGuard from 'src/common/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { GetJobPostsFilterDto } from 'src/job-posts/dtos/get-job-posts-filter.dto';
import { JobPostsService } from 'src/job-posts/services/job-posts.service';
import { UserRole } from 'src/users/schemas/user-role.enum';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UpdateBackofficeJobPostDto } from 'src/job-posts/dtos/update-backoffice-job-post.dto';
import { BufferedFile } from 'src/minio-client/file.interface';

@UseGuards(JwtAccessGuard, RolesGuard)
@ExcludeRoles(UserRole.Customer)
@Controller('backoffice/job-posts')
export class BackofficeJobPostsController {
  constructor(private readonly jobPostsService: JobPostsService) {}

  @Get('manager')
  async getJobPostsbyManager(
    @CurrentUser() user: UserDocument,
    @Query() getJobPostsFilterDto: GetJobPostsFilterDto,
  ) {
    const jobPosts = await this.jobPostsService.getJobPostsByManager(
      user,
      getJobPostsFilterDto,
    );
    return {
      statusCode: 200,
      message: 'get job posts successfully',
      jobPosts,
    };
  }

  @Roles(UserRole.Admin)
  @Get('admin')
  async getJobPostsByAdmin(
    @Query() getJobPostsFilterDto: GetJobPostsFilterDto,
  ) {
    const jobPosts = await this.jobPostsService.getJobPostsByAdmin(
      getJobPostsFilterDto,
    );
    return {
      statusCode: 200,
      message: 'get job posts successfully',
      jobPosts,
    };
  }

  @Get(':jobPostId')
  async getJobPost(@ObjectId('jobPostId') jobPostId: string) {
    const jobPost = await this.jobPostsService.getJobPostByIdAdmin(jobPostId);
    return {
      statusCode: 200,
      message: 'get job post successfully',
      jobPost,
    };
  }

  // delete job post to recycle bin
  @Patch(':jobPostId')
  @UseInterceptors(FilesInterceptor('images'))
  async updateJobPost(
    @CurrentUser() user: UserDocument,
    @ObjectId('jobPostId') jobPostId: string,
    @Body() updateJobPostDto: UpdateBackofficeJobPostDto,
    @UploadedFiles() images: BufferedFile[],
  ) {
    const jobPost = await this.jobPostsService.updateJobPostByBackoffice(
      user,
      jobPostId,
      updateJobPostDto,
      images,
    );

    return {
      statusCode: 200,
      message: 'update job post successfully',
      jobPost,
    };
  }

  @Delete(':jobPostId/recycle')
  async moveJobPostToRecycleBin(
    @CurrentUser() user: UserDocument,
    @ObjectId('jobPostId') jobPostId: string,
  ) {
    await this.jobPostsService.moveJobPostToRecycleBin(user, jobPostId);
    return {
      statusCode: 200,
      message: 'delete the job post successfully',
    };
  }
}
