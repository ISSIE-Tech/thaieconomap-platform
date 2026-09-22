import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAccessGuard from 'src/common/guards/jwt-access.guard';
import { JobPostsService } from '../services/job-posts.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDocument } from 'src/users/schemas/user.schema';
import { ObjectId } from 'src/common/decorators/object-id.decorator';
import { GetJobPostsFilterDto } from '../dtos/get-job-posts-filter.dto';
import { ApplyJobDto } from '../dtos/apply-job.dto';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.interface';
import { RequestUpdateJobPostDto } from '../dtos/request-update-job-post.dto';
import { GetTECJobPostsFilterDto } from '../dtos/get-tec-job-post-filter.dto';
import { ConfigService } from '@nestjs/config';

@Controller('job-posts')
export class JobPostsController {
  private readonly jobPostUrl: string

  constructor(
    private readonly jobPostsService: JobPostsService,
    private readonly submissionsService: SubmissionsService,
    private readonly configService: ConfigService,
  ) {
    this.jobPostUrl = this.configService.get<string>('LINE_LIFF_URL');
  }

  @Get('map-mark')
  async getJobPostsForTECMark(
    @Query() getTECJobPostsFilterDto: GetTECJobPostsFilterDto
  ) {
    const jobPost = await this.jobPostsService.getJobPostsForTECMark(getTECJobPostsFilterDto);
    return {
      statusCode: 200,
      message: 'get job post for TEC mark successfully',
      data: jobPost,
    };
  }

  @Get()
  async getJobPosts(@Query() getJobPostsFilterDto: GetJobPostsFilterDto) {
    const jobPosts = await this.jobPostsService.getJobPostsByCustomer(
      getJobPostsFilterDto,
    );
    return {
      statusCode: 200,
      message: 'get job posts successfully',
      jobPosts,
    };
  }

  @Get('categories')
  async getJobCategories() {
    const jobCategories = await this.jobPostsService.getJobCategories();
    return {
      statusCode: 200,
      message: 'get job categories successfully',
      jobCategories,
    };
  }

  @Get('wage-units')
  async getWageUnits() {
    const units = await this.jobPostsService.getJobWageUnits();
    return {
      statusCode: 200,
      message: 'get wage units successfully',
      units,
    };
  }

  // get job by job seeker
  @Get(':jobPostId')
  async getJobPostById(@ObjectId('jobPostId') jobPostId: string) {
    const jobPost = await this.jobPostsService.getJobPostById(jobPostId);

    return {
      statusCode: 200,
      message: 'get job post successfully',
      jobPost: {
        ...(jobPost.toObject()),
        liffUrl: `${this.jobPostUrl}/job/${jobPostId}`
      },
    };
  }

  // update job by job owner -> go to pending status
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Patch(':jobPostId')
  async updateJobPostById(
    @CurrentUser() user: UserDocument,
    @ObjectId('jobPostId') jobPostId: string,
    @Body() requestUpdateJobPostDto: RequestUpdateJobPostDto,
    @UploadedFiles() images: BufferedFile[],
  ) {
    const updatedJobPost = await this.jobPostsService.updateJobPostById(
      user,
      jobPostId,
      requestUpdateJobPostDto,
      images,
    );
    return {
      statusCode: 200,
      message: 'update job post successfully',
      jobPost: updatedJobPost,
    };
  }

  @UseGuards(JwtAccessGuard)
  @Post(':jobPostId/apply')
  async applyJob(
    @CurrentUser() user: UserDocument,
    @ObjectId('jobPostId') jobPostId: string,
    @Body() { additionalInformation }: ApplyJobDto,
  ) {
    const submission = await this.submissionsService.create(
      user,
      jobPostId,
      additionalInformation,
    );
    await this.jobPostsService.applyJob(jobPostId, submission);
    return {
      statusCode: 200,
      message: 'applied the job successfully',
    };
  }

  @UseGuards(JwtAccessGuard)
  @Patch(':jobPostId/close')
  async closeJobPost(
    @CurrentUser() user: UserDocument,
    @ObjectId('jobPostId') jobPostId: string,
  ) {
    await this.jobPostsService.closeJobPost(user, jobPostId);
    return {
      statusCode: 200,
      message: 'closed the job post successfully',
    };
  }

  @UseGuards(JwtAccessGuard)
  @Get(':jobPostId/submissions')
  async getJobPostSubmissions(
    @CurrentUser() user: UserDocument,
    @ObjectId('jobPostId') jobPostId: string,
  ) {
    const submissions = await this.jobPostsService.getJobPostSubmissions(
      user,
      jobPostId,
    );
    return {
      statusCode: 200,
      message: 'get submissions successfully',
      submissions,
    };
  }

  @UseGuards(JwtAccessGuard)
  @Get(':jobPostId/submissions/:candidateId/profile')
  async getCandidateProfile(
    @CurrentUser() user: UserDocument,
    @ObjectId('jobPostId') jobPostId: string,
    @ObjectId('candidateId') candidateId: string,
  ) {
    const candidateProfile = await this.jobPostsService.getCandidateProfile(
      user,
      jobPostId,
      candidateId,
    );
    return {
      statusCode: 200,
      message: 'get candidate profile successfully',
      candidateProfile,
    };
  }

  @UseGuards(JwtAccessGuard)
  @Post(':jobPostId/submissions/:candidateId/accept')
  async acceptCandidate(
    @CurrentUser() user: UserDocument,
    @ObjectId('jobPostId') jobPostId: string,
    @ObjectId('candidateId') candidateId: string,
  ) {
    const submissions = await this.submissionsService.accept(
      user,
      jobPostId,
      candidateId,
    );
    const acceptanceStatus =
      await this.jobPostsService.updateAcceptanceStatusByJobPostId(
        jobPostId,
        submissions,
      );

    return {
      statusCode: 200,
      message: 'accepted the candidate successfully',
      submissions,
      acceptanceStatus,
    };
  }

  @UseGuards(JwtAccessGuard)
  @Post(':jobPostId/submissions/:candidateId/reject')
  async rejectCandidate(
    @CurrentUser() user: UserDocument,
    @ObjectId('jobPostId') jobPostId: string,
    @ObjectId('candidateId') candidateId: string,
  ) {
    const submissions = await this.submissionsService.reject(
      user,
      jobPostId,
      candidateId,
    );
    const acceptanceStatus =
      await this.jobPostsService.updateAcceptanceStatusByJobPostId(
        jobPostId,
        submissions,
      );

    return {
      statusCode: 200,
      message: 'rejected the candidate successfully',
      submissions,
      acceptanceStatus,
    };
  }
}
