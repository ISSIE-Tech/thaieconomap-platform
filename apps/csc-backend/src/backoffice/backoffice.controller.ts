import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import JwtAccessGuard from 'src/common/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateJobCategoryDto } from 'src/job-posts/dtos/create-job-category.dto';
import { CreateWageUnitDto } from 'src/job-posts/dtos/create-wage-unit.dto';
import { JobPostsService } from 'src/job-posts/services/job-posts.service';
import { BufferedFile } from 'src/minio-client/file.interface';
import { UserRole } from 'src/users/schemas/user-role.enum';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UpdateJobCategoryIndexDto } from './dtos/update-job-category-index.dto';
import { ObjectId } from 'src/common/decorators/object-id.decorator';

@Controller('backoffice')
export class BackofficeController {
  constructor(
    private readonly jobPostsService: JobPostsService,
  ) {}

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @UseInterceptors(FileInterceptor('iconImage'))
  @Post('job-categories')
  async createJobCategory(
    @CurrentUser() user: UserDocument,
    @Body() createJobCategoryDto: CreateJobCategoryDto,
    @UploadedFile() iconImage: BufferedFile,
  ) {
    const jobCategory = await this.jobPostsService.createJobCategory(
      user,
      createJobCategoryDto,
      iconImage,
    );
    return {
      statusCode: 201,
      message: 'create the job category successfully',
      jobCategory,
    };
  }

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Patch('job-categories/arrange')
  async arrangeJobCategories(
    @Body() updateJobCategoryIndexDto: UpdateJobCategoryIndexDto,
  ) {
    const updatedMainJobCategories =
      await this.jobPostsService.arrangeJobCategories(
        updateJobCategoryIndexDto,
      );
    return {
      statusCode: 201,
      message: 'create the wage unit successfully',
      updatedMainJobCategories,
    };
  }

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Get('job-categories')
  async getJobCategories() {
    const jobCategories = await this.jobPostsService.getJobCategories();
    return {
      statusCode: 200,
      message: 'get the job categories successfully',
      jobCategories,
    };
  }

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Delete('job-categories/:jobCategoryId')
  async deleteJobCategory(@ObjectId('jobCategoryId') jobCategoryId: string) {
    const jobCategory = await this.jobPostsService.deleteJobCategory(
      jobCategoryId,
    );
    return {
      statusCode: 201,
      message: 'delete the job category successfully',
      jobCategory,
    };
  }

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Get('wage-units')
  async getWageUnits() {
    const wageUnits = await this.jobPostsService.getWageUnits();
    return {
      statusCode: 200,
      message: 'get the wage units successfully',
      wageUnits,
    };
  }

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Post('wage-units')
  async createWageUnit(@Body() createWageUnitDto: CreateWageUnitDto) {
    const wageUnit = await this.jobPostsService.createWageUnit(
      createWageUnitDto,
    );
    return {
      statusCode: 201,
      message: 'create the wage unit successfully',
      wageUnit,
    };
  }

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Delete('wage-units/:wageUnitId')
  async deleteWageUnit(@ObjectId('wageUnitId') wageUnitId: string) {
    const wageUnit = await this.jobPostsService.deleteWageUnit(wageUnitId);
    return {
      statusCode: 201,
      message: 'delete the wage unit successfully',
      wageUnit,
    };
  }
}
