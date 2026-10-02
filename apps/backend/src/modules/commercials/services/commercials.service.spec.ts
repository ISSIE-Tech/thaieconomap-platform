import 'reflect-metadata';

import { UserRole } from '@thaieconomap/contracts';

import { CODES } from '../../../shared/constants';
import { IUser } from '../../../shared/interfaces';

import { CommercialsService } from './commercials.service';

const OWNER_ID = '64b000000000000000000001';

const customer = (id: string) =>
  ({ _id: id, roles: { TEC: UserRole.CUSTOMER } }) as unknown as IUser;

// call deleteCommercial on a stub `this` so the test needs no Nest module or DB
const deleteAs = (user: IUser) => {
  const moveFile = jest.fn().mockResolvedValue('bin/commercials/a.jpg');
  const self = {
    logger: { debug: jest.fn(), verbose: jest.fn() },
    getCommercialById: jest.fn().mockResolvedValue({
      _id: 'c1',
      createdBy: { _id: OWNER_ID },
      imageUrl: 'commercials/a.jpg',
      category: 'RESTAURANT',
    }),
    minioClientService: { moveFile, moveFiles: jest.fn() },
    deletedcommercialsRepository: { create: jest.fn() },
    favoriteService: { deleteFavoriteByTargetId: jest.fn() },
    commercialsRepository: { findByIdAndDelete: jest.fn().mockResolvedValue({ _id: 'c1' }) },
  };

  return {
    run: () => CommercialsService.prototype.deleteCommercial.call(self, user, 'c1'),
    moveFile,
  };
};

describe('CommercialsService.deleteCommercial', () => {
  it('rejects a customer who does not own the shop', async () => {
    const { run, moveFile } = deleteAs(customer('64b000000000000000000002'));

    await expect(run()).rejects.toMatchObject({ response: { code: CODES.TEC_033.code } });
    expect(moveFile).not.toHaveBeenCalled();
  });

  it('lets the owner delete their own shop', async () => {
    const { run, moveFile } = deleteAs(customer(OWNER_ID));

    await expect(run()).resolves.toEqual({ _id: 'c1' });
    expect(moveFile).toHaveBeenCalled();
  });
});
