import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDocument } from './schemas/user.schema';
import JwtAccessGuard from 'src/common/guards/jwt-access.guard';
import { JobPostsService } from 'src/job-posts/services/job-posts.service';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { UpdateUserProfileDto } from './dtos/update-user-profile.dto';
import { BufferedFile } from 'src/minio-client/file.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'src/common/decorators/object-id.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jobPostsService: JobPostsService,
    private readonly submissionsService: SubmissionsService,
  ) {}

  @UseGuards(JwtAccessGuard)
  @Get('profile')
  async getUserProfile(@CurrentUser() user: UserDocument) {
    const profile = await this.usersService.getUserProfile(user._id.toString());
    return {
      statusCode: 200,
      message: 'get profile successfully',
      profile,
    };
  }

  @UseGuards(JwtAccessGuard)
  @Patch('profile')
  async updateUserProfile(
    @CurrentUser() user: UserDocument,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const profile = await this.usersService.update(
      user._id.toString(),
      updateUserProfileDto,
    );
    return {
      statusCode: 200,
      message: 'update user profile successfully',
      profile,
    };
  }

  @UseGuards(JwtAccessGuard)
  @Get('profile/job-posts')
  async getUserJobPosts(@CurrentUser() user: UserDocument) {
    const jobPosts = await this.jobPostsService.getUserJobPosts(user);
    return {
      statusCode: 200,
      message: 'get owned job posts successfully',
      jobPosts,
    };
  }

  @UseGuards(JwtAccessGuard)
  @Get('profile/submissions')
  async getUserSubmissions(@CurrentUser() user: UserDocument) {
    const submissions = await this.submissionsService.getUserSubmissions(user);
    return {
      statusCode: 200,
      message: 'get submissions successfully',
      submissions,
    };
  }

  @UseGuards(JwtAccessGuard)
  @Post('profile/submissions/:submissionId/cancel')
  async cancelUserSubmission(
    @CurrentUser() user: UserDocument,
    @ObjectId('submissionId') submissionId: string,
  ) {
    const submission = await this.submissionsService.cancel(user, submissionId);
    return {
      statusCode: 200,
      message: 'cancel submission successfully',
      submission,
    };
  }
}
