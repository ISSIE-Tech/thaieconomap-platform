import { CachingService } from './caching.service';
import { SyncStatus, SyncTrigger } from './schemas';

describe('CachingService sync history', () => {
  const build = (listShops: () => Promise<unknown[]>) => {
    const syncLogRepository = { create: jest.fn() };
    const service = new CachingService(
      { find: jest.fn().mockResolvedValue([]), bulkWrite: jest.fn(), deleteMany: jest.fn() } as never,
      { bulkWrite: jest.fn(), deleteMany: jest.fn() } as never,
      syncLogRepository as never,
      { listBases: jest.fn().mockResolvedValue([]), listShops } as never,
      { deleteFavoriteByTargetId: jest.fn() } as never,
    );

    return { service, syncLogRepository };
  };

  it('records a successful manual sync with who pressed it', async () => {
    const { service, syncLogRepository } = build(async () => []);

    await service.updateShopAndBaseCache(SyncTrigger.MANUAL, 'Admin A');

    expect(syncLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: SyncTrigger.MANUAL,
        triggeredBy: 'Admin A',
        status: SyncStatus.SUCCESS,
        errorMessage: null,
      }),
    );
  });

  it('records the upstream error and still fails the sync', async () => {
    const { service, syncLogRepository } = build(async () => {
      throw new Error('AUTH_API_KEY_INVALID');
    });

    await expect(service.scheduledShopAndBaseCacheSync()).rejects.toBeDefined();

    expect(syncLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: SyncTrigger.CRON,
        triggeredBy: null,
        status: SyncStatus.FAILURE,
        errorMessage: 'AUTH_API_KEY_INVALID',
      }),
    );
  });
});
