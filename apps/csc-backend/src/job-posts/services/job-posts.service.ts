import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JobPost, JobPostDocument } from '../schemas/job-post.schema';
import { Model, ObjectId, SortOrder } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import {
  JobCategory,
  JobCategoryDocument,
} from '../schemas/job-category.schema';
import { JobPostSubmissionStatus } from '../schemas/job-post-submission-status.enum';
import { GetJobPostsFilterDto } from '../dtos/get-job-posts-filter.dto';
import {
  Submission,
  SubmissionDocument,
} from 'src/submissions/schemas/submission.schema';
import {
  JobPostAcceptanceStatus,
  JobPostStatus,
} from '../schemas/job-post-status.enum';
import { SubmissionsService } from 'src/submissions/submissions.service';
import { JobSubmissionStatus } from 'src/submissions/schemas/job-submission-status-enum';
import { BufferedFile } from 'src/minio-client/file.interface';
import { RequestUpdateJobPostDto } from '../dtos/request-update-job-post.dto';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { WageUnit, WageUnitDocument } from '../schemas/wage-unit.schema';
import { IBaseQueryJobPostsFilter } from '../interfaces/base-query-filters.interface';
import { PaginationProcesser } from 'src/common/utils/pagination';
import { CreateJobCategoryDto } from '../dtos/create-job-category.dto';
import { CreateWageUnitDto } from '../dtos/create-wage-unit.dto';
import { UpdateJobCategoryIndexDto } from 'src/backoffice/dtos/update-job-category-index.dto';
import { GetTECJobPostsFilterDto } from '../dtos/get-tec-job-post-filter.dto';
import { JobPostLocation } from '../schemas/job-post-location.schema';
import { GeoJsonType } from '../../common/enum/geo-json-type.enum';
import { transformLatitudeAndLongitudeToGeoJson } from 'src/common/utils/transfrom';
import { ITecJobPostMark } from '../interfaces/tec-job-post-mark.interface';

@Injectable()
export class JobPostsService {
  constructor(
    private readonly submissionsService: SubmissionsService,
    private readonly minioClientService: MinioClientService,
    @InjectModel(JobPost.name)
    private readonly jobPostModel: Model<JobPostDocument>,
    @InjectModel(JobCategory.name)
    private readonly jobCategoryModel: Model<JobCategoryDocument>,
    @InjectModel(WageUnit.name)
    private readonly wageUnitModel: Model<WageUnitDocument>,
  ) {}

  private readonly baseCustomerProjections = {
    __v: 0,
    applicants: {
      submissions: 0,
    },
    reviewedAt: 0,
    reviewedBy: 0,
  };

  async getJobPostsForTECMark(
    getTECJobPostsFilterDto: GetTECJobPostsFilterDto
  ) {
    const query = this.calculateBaseQuery(getTECJobPostsFilterDto);
    query['status'] = JobPostStatus.Available;
    query['acceptanceStatus'] = {
      $ne: JobPostAcceptanceStatus.Full
    };

    if (getTECJobPostsFilterDto?.district) {
      query['location.address.district'] = getTECJobPostsFilterDto.district;
    }

    const projection = {
      _id: 1,
      title: 1,
      location: 1,
      acceptanceStatus: 1,
      category: 1,
      createdAt: 1,
      updatedAt: 1,
    }

    const jobPost = await this.jobPostModel.find(
      query, 
      projection,
    )
    .populate([
      {
        path: 'category',
        select: '_id name'
      }
    ])
    .lean()
    .exec();

    return jobPost.map((post: JobPostDocument) => {
      const { _id, location } = post;
      const geoLocation = transformLatitudeAndLongitudeToGeoJson(location);
      const jobPostMark: ITecJobPostMark = {
        ...post,
        _id: _id.toString(),
        location: geoLocation
      }
      return jobPostMark;
    });
  }

  async getJobPostsByCustomer(getJobPostsFilterDto: GetJobPostsFilterDto) {
    const { page, perPage, ascending, district } = getJobPostsFilterDto;
    const paginator = new PaginationProcesser(page, perPage);

    const { numberOfSkipItems, numberOfLimit } =
      paginator.calculateSkipAndLimit();

    const query = this.calculateBaseQuery(getJobPostsFilterDto);

    if (district) {
      query['location.address.district'] = district;
    }

    let sortOrder: SortOrder = 'descending';
    if (ascending) {
      sortOrder = 'ascending';
    }

    const jobPostsQuery = this.jobPostModel
      .find(query, this.baseCustomerProjections)
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

  async getJobPostsByManager(
    user: UserDocument,
    getJobPostsFilterDto: GetJobPostsFilterDto,
  ) {
    const { page, perPage, ascending, district } = getJobPostsFilterDto;
    const paginator = new PaginationProcesser(page, perPage);

    const { numberOfSkipItems, numberOfLimit } =
      paginator.calculateSkipAndLimit();

    const query = {
      $and: this.calculateBaseQuery(getJobPostsFilterDto),
    } as {};

    query['$or'] = user.districts.map((district) => {
      return {
        'location.address.district': district,
      };
    });

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
      .find(query)
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
        {
          path: 'reviewedBy',
          select: 'shortId name phoneNumber',
        },
      ]);

    const count = await this.jobPostModel.count(query);

    if (!paginator.isPageNumberValid(count))
      throw new BadRequestException('Invalid page');

    const data = await jobPostsQuery;

    return paginator.response(count, data);
  }

  async getJobPostsByAdmin(getJobPostsFilterDto: GetJobPostsFilterDto) {
    const { page, perPage, ascending, district } = getJobPostsFilterDto;
    const paginator = new PaginationProcesser(page, perPage);

    const { numberOfSkipItems, numberOfLimit } =
      paginator.calculateSkipAndLimit();

    const query = this.calculateBaseQuery(getJobPostsFilterDto);

    if (district) {
      query['location.address.district'] = district;
    }

    let sortOrder: SortOrder = 'descending';
    if (ascending) {
      sortOrder = 'ascending';
    }

    const jobPostsQuery = this.jobPostModel
      .find(query)
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
        {
          path: 'reviewedBy',
          select: 'shortId name phoneNumber',
        },
      ]);

    const count = await this.jobPostModel.count(query);

    if (!paginator.isPageNumberValid(count))
      throw new BadRequestException('Invalid page');

    const data = await jobPostsQuery;

    return paginator.response(count, data);
  }

  async getJobPostById(jobPostId: string) {
    const jobPost = await this.jobPostModel
      .findOne(
        {
          _id: jobPostId,
          submissionStatus: JobPostSubmissionStatus.Approved,
          deletedAt: null,
        },
        this.baseCustomerProjections,
      )
      .populate('createdBy', '_id lineId name phoneNumber')
      .populate('category');

    if (!jobPost) {
      throw new NotFoundException('the job post not found');
    }

    return jobPost;
  }

  async getJobPostByIdAdmin(jobPostId: string) {
    const jobPost = await this.jobPostModel
      .findOne(
        {
          _id: jobPostId,
          submissionStatus: JobPostSubmissionStatus.Approved,
          deletedAt: null,
        },
        this.baseCustomerProjections,
      )
      .populate('createdBy', '_id lineId name phoneNumber')
      .populate('category')
      .populate([
        {
          path: 'location.address.district',
        },
      ]);

    if (!jobPost) {
      throw new NotFoundException('the job post not found');
    }

    return jobPost;
  }

  async getBackofficeJobPostById(jobPostId: string) {
    const jobPost = await this.jobPostModel
      .findOne({
        _id: jobPostId,
        submissionStatus: JobPostSubmissionStatus.Approved,
        deletedAt: null,
      })
      .populate([
        {
          path: 'applicants.submissions',
        },
        {
          path: 'createdBy',
          select: '_id lineId name phoneNumber',
        },
        {
          path: 'category',
        },
        {
          path: 'reviewedBy',
          select: '_id shortId lineId name phoneNumber',
        },
      ]);

    if (!jobPost) {
      throw new NotFoundException('the job post not found');
    }

    return jobPost;
  }

  private async _getJobPostById(jobPostId: string) {
    const jobPost = await this.jobPostModel
      .findOne({
        _id: jobPostId,
        submissionStatus: JobPostSubmissionStatus.Approved,
        deletedAt: null,
      })
      .populate('createdBy');

    if (!jobPost) {
      throw new NotFoundException('the job post not found');
    }

    return jobPost;
  }

  async getJobCategories() {
    return await this.jobCategoryModel.find();
  }

  async getWageUnits() {
    return await this.wageUnitModel.find();
  }

  async createJobCategory(
    user: UserDocument,
    createJobCategoryDto: CreateJobCategoryDto,
    iconImage: BufferedFile,
  ) {
    const iconUrl = await this.minioClientService.uploadFile(iconImage);
    const jobCategory = new this.jobCategoryModel({
      name: createJobCategoryDto.name,
      iconUrl,
      createdBy: user._id,
    });
    await jobCategory.save();
    return jobCategory;
  }

  async deleteJobCategory(jobCategoryId: string) {
    try {
      await this.jobCategoryModel.findByIdAndDelete(jobCategoryId);
    } catch (error) {
      throw new BadRequestException('the job category is being used');
    }
  }

  async arrangeJobCategories(
    updateJobCategoryIndexDto: UpdateJobCategoryIndexDto,
  ) {
    await this.jobCategoryModel.updateMany(
      {},
      {
        isMain: false,
        index: -1,
      },
    );

    const { jobCategories } = updateJobCategoryIndexDto;

    const updatedJobCategories = await Promise.all(
      jobCategories.map(async (jobCategoriId, index) => {
        const jobCategory = await this.jobCategoryModel.findByIdAndUpdate(
          jobCategoriId,
          { index, isMain: true },
          { new: true },
        );
        return jobCategory;
      }),
    );
    return updatedJobCategories;
  }

  async getJobWageUnits() {
    return await this.wageUnitModel.find();
  }

  async deleteWageUnit(wageUnitId: string) {
    await this.wageUnitModel.findByIdAndDelete(wageUnitId);
  }

  async createWageUnit(createWageUnitDto: CreateWageUnitDto) {
    const wageUnit = new this.wageUnitModel({
      name: createWageUnitDto.name,
    });

    await wageUnit.save();
    return wageUnit;
  }

  async getJobCategoryByName(name: string) {
    return await this.jobCategoryModel.findOne({ name });
  }

  async applyJob(jobPostId: string, submission: SubmissionDocument) {
    const jobPost = await this.getJobPostById(jobPostId);

    jobPost.applicants.submissions.push(submission);

    await jobPost.save();
  }

  async closeJobPostByChangeStream(jobPostId: string) {
    const jobPost = await this._getJobPostById(jobPostId);
    jobPost.status = JobPostStatus.Closed;

    for (const submission of jobPost.applicants.submissions) {
      if (submission.status === JobSubmissionStatus.Pending) {
        await this.submissionsService.update((submission as any)._id, {
          status: JobSubmissionStatus.Expired,
        });
      }
    }

    return await jobPost.save();
  }

  async closeJobPost(user: UserDocument, jobPostId: string) {
    const jobPost = await this._getJobPostById(jobPostId);

    if (jobPost.createdBy.lineId !== user.lineId)
      throw new NotFoundException('the job post not found');

    jobPost.status = JobPostStatus.Closed;

    for (const submission of jobPost.applicants.submissions) {
      if (submission.status === JobSubmissionStatus.Pending) {
        await this.submissionsService.update((submission as any)._id, {
          status: JobSubmissionStatus.Expired,
        });
      }
    }

    return await jobPost.save();
  }

  async getJobPostSubmissions(user: UserDocument, jobPostId: string) {
    const jobPost = await this._getJobPostById(jobPostId);

    if (jobPost.createdBy.lineId !== user.lineId)
      throw new NotFoundException('the job post not found');

    const submissions = await jobPost.populate(
      'applicants.submissions',
      '-jobPost -additionalInformation',
    );
    return (
      await submissions.populate(
        'applicants.submissions.candidate',
        'name experiences',
      )
    ).applicants.submissions;
  }

  async getCandidateProfile(
    user: UserDocument,
    jobPostId: string,
    candidateId: string,
  ) {
    const jobPost = await this._getJobPostById(jobPostId);

    if (jobPost.createdBy.lineId !== user.lineId)
      throw new NotFoundException('the job post not found');

    const submission =
      await this.submissionsService.getCandidateProfileByJobPostAndCandidateId(
        jobPostId,
        candidateId,
      );
    const candidate = (
      await submission.populate(
        'candidate',
        '_id shortId name birthDate phoneNumber experiences',
      )
    ).toObject().candidate;

    return {
      ...candidate,
      additionalInformation: submission.additionalInformation,
    };
  }

  async getUserJobPosts(user: UserDocument) {
    // const jobPosts = await this.jobPostModel.find({
    //   // createdBy: user._id,
    // }).populate('category', '_id name iconUrl').populate('applicants.submissions')
    const jobPosts = await this.jobPostModel
      .find({
        createdBy: user._id,
        deletedAt: null,
      })
      .populate('category', '_id name iconUrl')
      .populate(
        'createdBy',
        'shortId name birthDate phoneNumber profileImageUrl experiences',
      )
      .populate({
        path: 'applicants.submissions',
        populate: {
          path: 'candidate',
          select:
            'shortId name birthDate phoneNumber profileImageUrl experiences',
        },
      });

    return jobPosts;
  }

  async updateAcceptanceStatusByJobPostId(
    jobPostId: string,
    submissions: Submission[],
  ) {
    const jobPost = await this.getJobPostById(jobPostId);
    const currentApplicantsNumber = submissions.reduce((acc, curr) => {
      if (curr.status === JobSubmissionStatus.Accepted) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);

    const status = this.determineAcceptanceStatus(
      jobPost.applicants.number,
      currentApplicantsNumber,
    );

    if (status === jobPost.acceptanceStatus) {
      return status;
    }

    await jobPost.updateOne({
      acceptanceStatus: status,
    });

    return status;
  }

  async moveJobPostToRecycleBin(user: UserDocument, jobPostId: string) {
    const jobPost = await this._getJobPostById(jobPostId);
    const newImageUrls = await Promise.all(
      jobPost.imageUrls.map(async (imageUrl) => {
        return this.minioClientService.moveObjectToRecycleBin(imageUrl);
      }),
    );

    await jobPost.updateOne({
      deletedAt: new Date(),
      deletedBy: user._id.toString(),
      imageUrls: newImageUrls,
    });
  }

  private determineAcceptanceStatus(max: number, current: number) {
    if (current >= max) {
      return JobPostAcceptanceStatus.Full;
    }

    if (current / max > 0.7) {
      return JobPostAcceptanceStatus.AlmostFull;
    }

    return JobPostAcceptanceStatus.Available;
  }

  async updateJobPostById(
    user: UserDocument,
    jobPostId: string,
    requestUpdateJobPostDto: RequestUpdateJobPostDto,
    images: BufferedFile[],
  ) {
    const jobPost = await this.getJobPostByIdAllSubmissionStatus(jobPostId);

    if (jobPost.createdBy.lineId !== user.lineId) {
      throw new NotFoundException('the job post not found');
    }

    await Promise.all(
      jobPost.imageUrls.map(async (imageUrl) => {
        await this.minioClientService.delete(imageUrl);
      }),
    );

    const imageUrls = await Promise.all(
      images.map(async (image) => {
        return this.minioClientService.uploadFile(image);
      }),
    );

    const number = requestUpdateJobPostDto.applicants.number;

    delete requestUpdateJobPostDto['applicants'];

    const updatedJobPost = await this.jobPostModel
      .findOneAndUpdate(
        {
          _id: jobPostId,
        },
        {
          ...requestUpdateJobPostDto,
          'applicants.number': number,
          imageUrls: imageUrls,
          submissionStatus: JobPostSubmissionStatus.Pending,
        },
        {
          ...this.baseCustomerProjections,
          new: true,
        },
      )
      .populate('createdBy', '_id name phoneNumber')
      .populate('category');

    return updatedJobPost;
  }

  private async getJobPostByIdAllSubmissionStatus(jobPostId: string) {
    const jobPost = await this.jobPostModel
      .findOne({
        _id: jobPostId,
        deletedAt: null,
      })
      .populate('createdBy');

    if (!jobPost) {
      throw new NotFoundException('the job post not found');
    }

    return jobPost;
  }

  private calculateBaseQuery(baseQuery: IBaseQueryJobPostsFilter) {
    const { category, searchTerm } = baseQuery;
    const query = {
      submissionStatus: JobPostSubmissionStatus.Approved,
      deletedAt: null,
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
}
