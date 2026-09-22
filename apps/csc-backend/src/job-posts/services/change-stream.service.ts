import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  OnCloseJobPost,
  OnCloseJobPostDocument,
} from '../schemas/on-close-job-post.schema';
import { Model } from 'mongoose';
import { JobPostsService } from './job-posts.service';

@Injectable()
export class ChangeStreamService implements OnModuleInit {
  constructor(
    private readonly jobPostsService: JobPostsService,
    @InjectModel(OnCloseJobPost.name)
    private readonly onCloseJobPostModel: Model<OnCloseJobPostDocument>,
  ) {}

  onModuleInit() {
    this.onCloseJobPostModel.collection
      .watch<OnCloseJobPostDocument>()
      .on('delete', (data) => {
        this.jobPostsService.closeJobPostByChangeStream(data.documentKey);
      });
  }
}
