import { CscJobsService } from './csc-jobs.service';
import { SyncSource, SyncStatus, SyncTrigger } from './schemas';

describe('CscJobsService sync', () => {
  const mark = (id: string, category = 'c1') => ({
    _id: id,
    title: id,
    category: { _id: category, name: category },
    location: { type: 'Point', coordinates: [100, 13] },
  });

  const build = (chialShare: Record<string, jest.Mock>) => {
    const model = () => ({ bulkWrite: jest.fn(), deleteMany: jest.fn() });
    const jobPostModel = model();
    const jobCategoryModel = model();
    const syncLogRepository = { create: jest.fn() };
    const service = new CscJobsService(
      jobPostModel as never,
      jobCategoryModel as never,
      syncLogRepository as never,
      {
        listJobCategories: jest.fn().mockResolvedValue([{ _id: 'c1', name: 'c1' }]),
        listJobPostMarks: jest.fn().mockResolvedValue([]),
        getJobPost: jest.fn(async (id: string) => ({ _id: id })),
        ...chialShare,
      } as never,
    );

    return { service, jobPostModel, jobCategoryModel, syncLogRepository };
  };

  it('caches each open post with its detail and drops posts csc no longer lists', async () => {
    const { service, jobPostModel, syncLogRepository } = build({
      listJobPostMarks: jest.fn().mockResolvedValue([mark('a'), mark('b'), mark('gone')]),
      // closed between the list and the detail call
      getJobPost: jest.fn(async (id: string) => (id === 'gone' ? null : { _id: id, title: id })),
    });

    await service.syncJobs(SyncTrigger.MANUAL, 'Admin A');

    const writes = jobPostModel.bulkWrite.mock.calls[0][0];

    expect(writes.map(w => w.updateOne.filter._id)).toEqual(['a', 'b']);
    // $set, not replace: an admin's `hidden` flag must survive the sync
    expect(writes[0].updateOne.update.$set).not.toHaveProperty('hidden');
    expect(writes[0].updateOne.update.$set).toMatchObject({
      categoryId: 'c1',
      mark: { title: 'a' },
      detail: { title: 'a' },
    });
    expect(jobPostModel.deleteMany).toHaveBeenCalledWith({ _id: { $nin: ['a', 'b'] } });
    expect(syncLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        source: SyncSource.CSC,
        status: SyncStatus.SUCCESS,
        jobsReceived: 3,
        jobsSaved: 2,
        jobCategoriesSaved: 1,
      }),
    );
  });

  it('empties the cache when csc has no open posts', async () => {
    const { service, jobPostModel } = build({});

    await service.syncJobs(SyncTrigger.CRON, null);

    expect(jobPostModel.bulkWrite).not.toHaveBeenCalled();
    expect(jobPostModel.deleteMany).toHaveBeenCalledWith({ _id: { $nin: [] } });
  });

  it('leaves the cache alone when a detail call fails', async () => {
    const { service, jobPostModel, jobCategoryModel, syncLogRepository } = build({
      listJobPostMarks: jest.fn().mockResolvedValue([mark('a')]),
      getJobPost: jest.fn().mockRejectedValue(new Error('csc down')),
    });

    await expect(service.syncJobs(SyncTrigger.CRON, null)).rejects.toBeDefined();

    expect(jobPostModel.deleteMany).not.toHaveBeenCalled();
    expect(jobCategoryModel.deleteMany).not.toHaveBeenCalled();
    expect(syncLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ status: SyncStatus.FAILURE, errorMessage: 'csc down' }),
    );
  });
});
