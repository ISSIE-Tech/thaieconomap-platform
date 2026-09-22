import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ObjectId } from 'src/common/decorators/object-id.decorator';
import { ExcludeRoles } from 'src/common/decorators/roles.decorator';
import JwtAccessGuard from 'src/common/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { GetJobPostsFilterDto } from 'src/job-posts/dtos/get-job-posts-filter.dto';
import { DeletedJobPostsService } from 'src/job-posts/services/deleted-job-posts.service';
import { UserRole } from 'src/users/schemas/user-role.enum';

@UseGuards(JwtAccessGuard, RolesGuard)
@ExcludeRoles(UserRole.Customer)
@Controller('backoffice/deleted-job-posts')
export class BackofficeDeletedJobPostsController {
  constructor(
    private readonly deletedJobPostsService: DeletedJobPostsService,
  ) {}

  @Get('all')
  async getDeletedJobPosts(
    @Query() getJobPostsFilterDto: GetJobPostsFilterDto,
  ) {
    const deletedJobPosts =
      await this.deletedJobPostsService.getDeletedJobPosts(
        getJobPostsFilterDto,
      );
    return {
      statusCode: 200,
      message: 'get deleted job posts successfully',
      deletedJobPosts,
    };
  }

  @Get(':deletedJobPostId')
  async getDeletedJobPost(
    @ObjectId('deletedJobPostId') deletedJobPostId: string,
  ) {
    const deletedJobPost =
      await this.deletedJobPostsService.getDeletedJobPostById(deletedJobPostId);
    return {
      statusCode: 200,
      message: 'get deleted job post successfully',
      deletedJobPost,
    };
  }

  // restore job post from recycle bin
  @Post(':deletedJobPostId/restore')
  async restoreDeletedJobPost(
    @ObjectId('deletedJobPostId') deletedJobPostId: string,
  ) {
    await this.deletedJobPostsService.restoreDeletedJobPost(deletedJobPostId);
    return {
      statusCode: 200,
      message: 'restore the job post successfully',
    };
  }

  @Delete(':deletedJobPostId')
  async deleteDeletedJobPost(
    @ObjectId('deletedJobPostId') deletedJobPostId: string,
  ) {
    await this.deletedJobPostsService.delete(deletedJobPostId);
    return {
      statusCode: 200,
      message: 'permenantly deleted the job post successfully',
    };
  }
}
