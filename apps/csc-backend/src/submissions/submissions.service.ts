import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Submission } from './schemas/submission.schema';
import { Model, UpdateQuery } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { JobSubmissionStatus } from './schemas/job-submission-status-enum';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name)
    private readonly submissionModel: Model<Submission>,
  ) {}

  async create(
    user: UserDocument,
    jobPostId: string,
    additionalInformation: string,
  ) {
    const submission = await this.submissionModel.findOne({
      jobPost: jobPostId,
      candidate: user._id,
    });

    if (submission) {
      throw new ConflictException('user already applied');
    }

    const newSubmission = new this.submissionModel({
      jobPost: jobPostId,
      candidate: user._id,
      additionalInformation,
    });

    return await newSubmission.save();
  }

  async update(
    submissionId: string,
    updateSubmissionQuery: UpdateQuery<Submission>,
  ) {
    const updatedSubmission = await this.submissionModel.findByIdAndUpdate(
      submissionId,
      updateSubmissionQuery,
      {
        new: true,
      },
    );
    return updatedSubmission;
  }

  async getSubmisssionsByJobPostId(jobPostId: string) {
    const submissions = await this.submissionModel
      .find({
        jobPost: jobPostId,
      })
      .populate(
        'candidate',
        'shortId name birthDate phoneNumber profileImageUrl experiences',
      );

    return submissions;
  }

  async getCandidateProfileByJobPostAndCandidateId(
    jobPostId: string,
    candidateId: string,
  ) {
    const submission = await this.submissionModel.findOne({
      jobPost: jobPostId,
      candidate: candidateId,
    });

    if (!submission) throw new NotFoundException('submission not found');

    return submission;
  }

  async accept(user: UserDocument, jobPostId: string, candidateId: string) {
    const submission = await this.getCandidateProfileByJobPostAndCandidateId(
      jobPostId,
      candidateId,
    );
    const populatedSubmission = await (
      await submission.populate('jobPost', 'createdBy')
    ).populate('jobPost.createdBy', 'lineId');

    if (populatedSubmission.jobPost.createdBy.lineId !== user.lineId) {
      throw new NotFoundException('submission not found');
    }

    submission.status = JobSubmissionStatus.Accepted;
    await submission.save();
    return await this.getSubmisssionsByJobPostId(jobPostId);
  }

  async reject(user: UserDocument, jobPostId: string, candidateId: string) {
    const submission = await this.getCandidateProfileByJobPostAndCandidateId(
      jobPostId,
      candidateId,
    );
    const populatedSubmission = await (
      await submission.populate('jobPost', 'createdBy')
    ).populate('jobPost.createdBy', 'lineId');

    if (populatedSubmission.jobPost.createdBy.lineId !== user.lineId) {
      throw new NotFoundException('submission not found');
    }

    submission.status = JobSubmissionStatus.Rejected;
    await submission.save();
    return await this.getSubmisssionsByJobPostId(jobPostId);
  }

  async cancel(user: UserDocument, submissionId: string) {
    const submission = await this.submissionModel.findOne({
      _id: submissionId,
      candidate: user._id.toString(),
    });

    if (
      !submission ||
      submission.status === JobSubmissionStatus.Accepted ||
      submission.status === JobSubmissionStatus.Rejected
    ) {
      throw new NotFoundException();
    }

    await submission.updateOne(
      {
        status: JobSubmissionStatus.Cancelled,
      },
      {
        new: true,
      },
    );
    const updatedSubmission = await this.submissionModel
      .findById(submissionId)
      .populate({
        path: 'jobPost',
        select: '_id title category description wage qualification createdBy',
        populate: [
          {
            path: 'category',
            select: 'name',
          },
          {
            path: 'createdBy',
            select: 'name phoneNumber',
          },
        ],
      });

    return updatedSubmission;
  }

  async getUserSubmissions(user: UserDocument) {
    const submissions = await this.submissionModel
      .find({
        candidate: user._id.toString(),
      })
      .populate({
        path: 'jobPost',
        select: '_id title category description wage qualification createdBy',
        populate: [
          {
            path: 'category',
            select: 'name',
          },
          {
            path: 'createdBy',
            select: 'name phoneNumber',
          },
        ],
      });

    return submissions;
  }
}
