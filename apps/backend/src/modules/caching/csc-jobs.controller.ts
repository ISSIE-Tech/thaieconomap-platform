import { Controller, Get, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

import { ObjectId } from '../../common/decorators';
import { DOC_DESCRIPTION } from '../../shared/constants';

import { CscJobsService } from './csc-jobs.service';

// Public job map data, served from the csc cache in the same shapes csc-backend uses.
@Controller('csc-jobs')
export class CscJobsController {
  constructor(private readonly cscJobsService: CscJobsService) {}

  @ApiOkResponse({ description: 'Open job posts for the map.' })
  @ApiQuery({ name: 'category', required: false })
  @Get('map-mark')
  async listMarks(@Query('category') category?: string) {
    return this.cscJobsService.listMarks(category);
  }

  @ApiOkResponse({ description: 'Job categories.' })
  @Get('categories')
  async listCategories() {
    return this.cscJobsService.listCategories();
  }

  @ApiOkResponse({ description: 'One job post.' })
  @ApiNotFoundResponse({ description: DOC_DESCRIPTION.ENTITY_NOT_FOUND('Job post') })
  @ApiParam({ name: 'jobPostId' })
  @Get(':jobPostId')
  async getJobPost(@ObjectId('jobPostId') jobPostId: string) {
    return this.cscJobsService.getJobPost(jobPostId);
  }
}
