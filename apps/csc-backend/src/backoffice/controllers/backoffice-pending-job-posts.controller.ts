import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ObjectId } from 'src/common/decorators/object-id.decorator';
import { ExcludeRoles, Roles } from 'src/common/decorators/roles.decorator';
import JwtAccessGuard from 'src/common/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RejectPendingJobPostDto } from 'src/job-posts/dtos/reject-pending-job-post.dto';
import { PendingJobPostsService } from 'src/job-posts/services/pending-job-post.service';
import { UserRole } from 'src/users/schemas/user-role.enum';
import { UserDocument } from 'src/users/schemas/user.schema';
import { GetPendingJobPostsFilterDto } from '../dtos/get-pending-job-posts-filters.dto';

@UseGuards(JwtAccessGuard, RolesGuard)
@ExcludeRoles(UserRole.Customer)
@Controller('backoffice/pending-job-posts')
export class BackofficePendingJobPostsController {
  constructor(
    private readonly pendingJobPostsService: PendingJobPostsService,
  ) {}

  @Get('manager')
  async getPendingJobPostsbyManager(
    @CurrentUser() user: UserDocument,
    @Query() getPendingJobPostsFilterDto: GetPendingJobPostsFilterDto,
  ) {
    const pendingJobPosts =
      await this.pendingJobPostsService.getPendingJobPostsByManager(
        user,
        getPendingJobPostsFilterDto,
      );
    return {
      statusCode: 200,
      message: 'get pending job posts successfully',
      pendingJobPosts,
    };
  }

  @Roles(UserRole.Admin)
  @Get('admin')
  async getPendingJobPostsByAdmin(
    @Query() getPendingJobPostsFilterDto: GetPendingJobPostsFilterDto,
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
  async getPendingJobPost(
    @ObjectId('pendingJobPostId') pendingJobPostId: string,
  ) {
    const pendingJobPost =
      await this.pendingJobPostsService.getPendingJobPostById(pendingJobPostId);
    return {
      statusCode: 200,
      message: 'get pending job post successfully',
      pendingJobPost,
    };
  }

  @Post(':pendingJobPostId/approve')
  async approvePendingJobPost(
    @CurrentUser() user: UserDocument,
    @ObjectId('pendingJobPostId') pendingJobPostId: string,
  ) {
    if (user.role === UserRole.Admin) {
      await this.pendingJobPostsService.approve(user, pendingJobPostId);
    } else {
      await this.pendingJobPostsService.approveByManager(
        user,
        pendingJobPostId,
      );
    }
    return {
      statusCode: 200,
      message: 'approved successfully',
    };
  }

  @Post(':pendingJobPostId/reject')
  async rejectPendingJobPost(
    @CurrentUser() user: UserDocument,
    @ObjectId('pendingJobPostId') pendingJobPostId: string,
    @Body() rejectPendingJobPostDto: RejectPendingJobPostDto,
  ) {
    if (user.role === UserRole.Admin) {
      await this.pendingJobPostsService.reject(
        user,
        pendingJobPostId,
        rejectPendingJobPostDto,
      );
    } else {
      await this.pendingJobPostsService.rejectByManager(
        user,
        pendingJobPostId,
        rejectPendingJobPostDto,
      );
    }
    return {
      statusCode: 200,
      message: 'rejected successfully',
    };
  }
}
