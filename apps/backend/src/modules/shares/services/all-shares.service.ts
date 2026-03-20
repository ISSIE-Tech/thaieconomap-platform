import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { FilterQuery } from 'mongoose';
import { Span } from 'nestjs-otel';

import { IAllCommercial, IUser } from '../../../shared/interfaces';
import { IAllShare } from '../../../shared/interfaces/share.interface';
import { getSpanName, prettyObjectString } from '../../../shared/utils';

import { DeletedSharesService } from './deleted-shares.service';
import { PendingSharesService } from './pending-shares.service';
import { SharesService } from './shares.service';

@Injectable()
export class AllSharesService {
  private readonly logger: Logger = new Logger(AllSharesService.name);

  constructor(
    @Inject(forwardRef(() => SharesService))
    private readonly sharesService: SharesService,

    @Inject(forwardRef(() => PendingSharesService))
    private readonly pendingSharesService: PendingSharesService,

    @Inject(forwardRef(() => DeletedSharesService))
    private readonly deletedSharesService: DeletedSharesService,
  ) {}

  @Span('Get All Shares')
  async getAll(user: IUser): Promise<IAllShare[]> {
    this.logger.debug(
      `{${AllSharesService.name}-[${getSpanName()}]} (called)\
            \n[param] ${prettyObjectString({
              userId: user._id,
              roles: user?.roles.TEC,
            })}`,
    );

    const [shares, pendingShares, deletedShares] = await Promise.all([
      this.sharesService.getAllShares(user),
      this.pendingSharesService.getAllPendingShares(user),
      this.deletedSharesService.getAllDeletedShare(user),
    ]);

    return [...shares, ...pendingShares, ...deletedShares];
  }

  @Span('Check If Share Exists')
  async isShareExists(filterQuery: FilterQuery<IAllCommercial>): Promise<boolean> {
    this.logger.debug(
      `{${AllSharesService.name}-[${getSpanName()}]} (called)\
          \n[param] ${prettyObjectString({
            filterQuery,
          })}`,
    );

    const idProjection = { _id: 1 };
    const [commercials, pendingCommercials, deletedCommercials] = await Promise.all([
      this.sharesService.getOne(filterQuery, idProjection),
      this.pendingSharesService.getOne(filterQuery, idProjection),
      this.deletedSharesService.getOne(filterQuery, idProjection),
    ]);

    return Boolean(commercials) || Boolean(pendingCommercials) || Boolean(deletedCommercials);
  }
}
