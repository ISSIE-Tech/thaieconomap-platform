import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAccessGuard from 'src/common/guards/jwt-access.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDocument } from 'src/users/schemas/user.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.interface';
import { CreatePendingJobPostsDto } from '../dtos/create-pending-job-posts.dto';
import { PendingJobPostsService } from '../services/pending-job-post.service';
import { ExcludeRoles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/schemas/user-role.enum';
import { ObjectId } from 'src/common/decorators/object-id.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RejectPendingJobPostDto } from '../dtos/reject-pending-job-post.dto';
import { GetJobPostsFilterDto } from '../dtos/get-job-posts-filter.dto';

@Controller('pending-job-posts')
export class PendingJobPostsController {
  constructor(
    private readonly pendingJobPostsService: PendingJobPostsService,
  ) {}

  @Get()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @ExcludeRoles(UserRole.Customer)
  async getPendingJobPost(
    @Query() getPendingJobPostsFilterDto: GetJobPostsFilterDto,
  ) {
    const pendingJobPosts =
      await this.pendingJobPostsService.getPendingJobPosts(
        getPendingJobPostsFilterDto,
      );
    return {
      statusCode: 200,
      message: 'get pending job posts successfully',
      pendingJobPosts,
    };
  }

  @Get(':pendingJobPostId')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @ExcludeRoles(UserRole.Customer)
  async getPendingJobPostById(
    @ObjectId('pendingJobPostId') pendingJobPostId: string,
  ) {
    const pendingJobPost =
      await this.pendingJobPostsService.getPendingJobPostById(pendingJobPostId);
    return {
      statusCode: 200,
      message: 'get pending job post by id successfully',
      pendingJobPost,
    };
  }

  @UseGuards(JwtAccessGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  async createPendingJobPost(
    @CurrentUser() user: UserDocument,
    @Body() createPendingJobPostDto: CreatePendingJobPostsDto,
    @UploadedFiles() images: BufferedFile[],
  ) {
    const pendingJobPost = await this.pendingJobPostsService.create(
      user,
      createPendingJobPostDto,
      images,
    );
    return {
      statusCode: 201,
      message: 'create pending job post successfully',
      pendingJobPost,
    };
  }
  @UseGuards(JwtAccessGuard, RolesGuard)
  @ExcludeRoles(UserRole.Customer)
  @Post(':pendingJobPostId/approve')
  async approvePendingJobPost(
    @CurrentUser() user: UserDocument,
    @ObjectId('pendingJobPostId') pendingJobPostId: string,
  ) {
    await this.pendingJobPostsService.approve(user, pendingJobPostId);
    return {
      statusCode: 200,
      message: 'approved successfully',
    };
  }

  @UseGuards(JwtAccessGuard, RolesGuard)
  @ExcludeRoles(UserRole.Customer)
  @Post(':pendingJobPostId/reject')
  async rejectPendingJobPost(
    @CurrentUser() user: UserDocument,
    @ObjectId('pendingJobPostId') pendingJobPostId: string,
    @Body() rejectPendingJobPostDto: RejectPendingJobPostDto,
  ) {
    await this.pendingJobPostsService.reject(
      user,
      pendingJobPostId,
      rejectPendingJobPostDto,
    );
    return {
      statusCode: 200,
      message: 'rejected successfully',
    };
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':pendingJobPostId')
  async deletePendingJobPost(
    @CurrentUser() user: UserDocument,
    @ObjectId('pendingJobPostId') pendingJobPostId: string,
  ) {
    await this.pendingJobPostsService.deleteRejectedJobPost(
      user,
      pendingJobPostId,
    );
    return {
      statusCode: 200,
      message: 'deleted successfully',
    };
  }
}
