import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JobPost, JobPostDocument } from '../schemas/job-post.schema';
import { Model, SortOrder } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import {
  JobCategory,
  JobCategoryDocument,
} from '../schemas/job-category.schema';
import { CreatePendingJobPostsDto } from '../dtos/create-pending-job-posts.dto';
import { BufferedFile } from 'src/minio-client/file.interface';
import { JobPostSubmissionStatus } from '../schemas/job-post-submission-status.enum';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { RejectPendingJobPostDto } from '../dtos/reject-pending-job-post.dto';
import { GetJobPostsFilterDto } from '../dtos/get-job-posts-filter.dto';
import { PaginationProcesser } from 'src/common/utils/pagination';
import { IBaseQueryJobPostsFilter } from '../interfaces/base-query-filters.interface';
import { OnCloseJobPost } from '../schemas/on-close-job-post.schema';

@Injectable()
export class PendingJobPostsService {
  constructor(
    private readonly minioClientService: MinioClientService,
    @InjectModel(JobPost.name)
    private readonly jobPostModel: Model<JobPostDocument>,
    @InjectModel(JobCategory.name)
    private readonly jobCategoryModel: Model<JobCategoryDocument>,
    @InjectModel(OnCloseJobPost.name)
    private readonly onCloseJobPostModel: Model<OnCloseJobPost>,
  ) {}

  private readonly baseProjections = {
    __v: 0,
  };

  async create(
    user: UserDocument,
    createPendingJobPostDto: CreatePendingJobPostsDto,
    images: BufferedFile[],
  ) {
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        return this.minioClientService.uploadFile(image);
      }),
    );

    const pendingJobPost = {
      createdBy: user._id,
      ...createPendingJobPostDto,
      imageUrls,
    };

    const createdPendingJobPost = new this.jobPostModel(pendingJobPost);
    await createdPendingJobPost.save();

    return createdPendingJobPost.populate(
      'location.address.district createdBy category',
    );
  }

  async approve(user: UserDocument, pendingJobPostId: string) {
    await this.jobPostModel.updateOne(
      {
        _id: pendingJobPostId,
        submissionStatus: JobPostSubmissionStatus.Pending,
      },
      {
        submissionStatus: JobPostSubmissionStatus.Approved,
        reviewedAt: new Date(),
        reviewedBy: user._id,
      },
    );

    // send notification
  }

  async approveByManager(user: UserDocument, pendingJobPostId: string) {
    const pendingJobPost = await this.getPendingJobPostById(pendingJobPostId);
    if (!this.isUserInPendingJobPostDistrict(user, pendingJobPost)) {
      throw new NotFoundException();
    }
    await this.approve(user, pendingJobPostId);
    // create on close post event collection
    if (pendingJobPost.closeDate) {
      const onCloseJobPost = new this.onCloseJobPostModel({
        _id: pendingJobPostId,
        closedAt: pendingJobPost.closeDate,
      });
      await onCloseJobPost.save();
    }
  }

  async reject(
    user: UserDocument,
    pendingJobPostId: string,
    rejectPendingJobPostDto: RejectPendingJobPostDto,
  ) {
    await this.jobPostModel.updateOne(
      {
        _id: pendingJobPostId,
        submissionStatus: JobPostSubmissionStatus.Pending,
      },
      {
        submissionStatus: JobPostSubmissionStatus.Rejected,
        reviewedAt: new Date(),
        reviewedBy: user._id,
        rejectMessage: rejectPendingJobPostDto.rejectMessage,
      },
    );

    // send notification
  }

  async rejectByManager(
    user: UserDocument,
    pendingJobPostId: string,
    rejectPendingJobPostDto: RejectPendingJobPostDto,
  ) {
    const pendingJobPost = await this.getPendingJobPostById(pendingJobPostId);
    if (!this.isUserInPendingJobPostDistrict(user, pendingJobPost)) {
      throw new NotFoundException();
    }
    await this.reject(user, pendingJobPostId, rejectPendingJobPostDto);
  }

  async deleteRejectedJobPost(user: UserDocument, pendingJobPostId: string) {
    const jobPost = await this.jobPostModel.findById(pendingJobPostId);

    if (user._id.toString() !== (jobPost.createdBy.toString() as any)) {
      throw new NotFoundException();
    }

    await jobPost.deleteOne();
  }

  async getPendingJobPostById(pendingJobPostId: string) {
    const pendingJobPost = await this.jobPostModel
      .findOne({
        _id: pendingJobPostId,
        submissionStatus: JobPostSubmissionStatus.Pending,
      })
      .populate([
        {
          path: 'createdBy',
          select: 'name phoneNumber',
        },
        {
          path: 'category',
        },
        {
          path: 'location.address.district',
        },
      ]);

    if (!pendingJobPost) {
      throw new NotFoundException();
    }

    return pendingJobPost;
  }

  async getPendingJobPosts(getPendingJobPostsFilterDto: GetJobPostsFilterDto) {
    const { page, perPage, ascending, district } = getPendingJobPostsFilterDto;
    const paginator = new PaginationProcesser(page, perPage);

    const { numberOfSkipItems, numberOfLimit } =
      paginator.calculateSkipAndLimit();

    const query = this.calculateBaseQuery(getPendingJobPostsFilterDto);

    if (district) {
      query['location.address.district'] = district;
    }

    let sortOrder: SortOrder = 'descending';
    if (ascending) {
      sortOrder = 'ascending';
    }

    const jobPostsQuery = this.jobPostModel
      .find(query, this.baseProjections)
      .sort({ createdAt: sortOrder })
      .skip(numberOfSkipItems)
      .limit(numberOfLimit)
      .populate([
        {
          path: 'createdBy',
          select: 'name phoneNumber',
        },
        {
          path: 'category',
        },
      ]);

    const count = await this.jobPostModel.count(query);

    if (!paginator.isPageNumberValid(count))
      throw new BadRequestException('Invalid page');

    const data = await jobPostsQuery;

    return paginator.response(count, data);
  }

  async getPendingJobPostsByManager(
    user: UserDocument,
    getPendingJobPostsFilterDto: GetJobPostsFilterDto,
  ) {
    const { page, perPage, ascending, district } = getPendingJobPostsFilterDto;
    const paginator = new PaginationProcesser(page, perPage);

    const { numberOfSkipItems, numberOfLimit } =
      paginator.calculateSkipAndLimit();

    const query = {
      $and: [this.calculateBaseQuery(getPendingJobPostsFilterDto)],
    } as {};

    // a manager with no districts matches nothing; `$or: []` makes mongo throw
    if (user.districts.length) {
      query['$or'] = user.districts.map((district) => {
        return {
          'location.address.district': district,
        };
      });
    } else {
      query['$and'].push({ _id: null });
    }

    if (district) {
      //@ts-ignore
      if (!user.districts.includes(district)) {
        throw new ForbiddenException();
      }

      delete query['$or'];
      query['$and'].push({
        'location.address.district': district,
      });
    }

    let sortOrder: SortOrder = 'descending';
    if (ascending) {
      sortOrder = 'ascending';
    }

    const jobPostsQuery = this.jobPostModel
      .find(query, this.baseProjections)
      .sort({ createdAt: sortOrder })
      .skip(numberOfSkipItems)
      .limit(numberOfLimit)
      .populate([
        {
          path: 'createdBy',
          select: 'name phoneNumber',
        },
        {
          path: 'category',
        },
      ]);

    const count = await this.jobPostModel.count(query);

    if (!paginator.isPageNumberValid(count))
      throw new BadRequestException('Invalid page');

    const data = await jobPostsQuery;

    return paginator.response(count, data);
  }

  private calculateBaseQuery(baseQuery: IBaseQueryJobPostsFilter) {
    const { category, searchTerm } = baseQuery;
    const query = {
      submissionStatus: JobPostSubmissionStatus.Pending,
    };

    if (category) {
      query['category'] = category;
    }

    if (searchTerm) {
      query['title'] = {
        $regex: searchTerm,
      };
    }

    return query;
  }

  private isUserInPendingJobPostDistrict(
    user: UserDocument,
    pendingJobPost: JobPostDocument,
  ) {
    const pendingJobPostDistrictId = (
      pendingJobPost.location.address.district as any
    )._id;
    return user.districts.includes(pendingJobPostDistrictId);
  }
}
