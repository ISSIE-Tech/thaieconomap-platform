import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { FilterQuery } from 'mongoose';
import { Span } from 'nestjs-otel';

import { IAllCommercial, IUser } from '../../../shared/interfaces';
import { getSpanName, prettyObjectString } from '../../../shared/utils';

import { CommercialsService } from './commercials.service';
import { DeletedCommercialsService } from './deleted-commercials.service';
import { PendingCommercialsService } from './pending-commercials.service';

@Injectable()
export class AllCommercialsService {
  private readonly logger: Logger = new Logger(AllCommercialsService.name);

  constructor(
    @Inject(forwardRef(() => CommercialsService))
    private readonly commercialsService: CommercialsService,

    @Inject(forwardRef(() => PendingCommercialsService))
    private readonly pendingCommercialsService: PendingCommercialsService,

    @Inject(forwardRef(() => DeletedCommercialsService))
    private readonly deletedCommercialsService: DeletedCommercialsService,
  ) {}

  @Span('Get All Commercials')
  async getAll(user: IUser): Promise<IAllCommercial[]> {
    this.logger.debug(
      `{${AllCommercialsService.name}-[${getSpanName()}]} (called)\
            \n[param] ${prettyObjectString({
              userId: user._id,
              roles: user?.roles.TEC,
            })}`,
    );

    const [commercials, pendingCommercials, deletedCommercials] = await Promise.all([
      this.commercialsService.getAllCommercials(user),
      this.pendingCommercialsService.getAllPendingCommercials(user),
      this.deletedCommercialsService.getAllDeletedCommercials(user),
    ]);

    return [...commercials, ...pendingCommercials, ...deletedCommercials];
  }

  @Span('Check If Commercial Exists')
  async isCommercialExists(filterQuery: FilterQuery<IAllCommercial>): Promise<boolean> {
    this.logger.debug(
      `{${AllCommercialsService.name}-[${getSpanName()}]} (called)\
          \n[param] ${prettyObjectString({
            filterQuery,
          })}`,
    );

    const idProjection = { _id: 1 };
    const [commercials, pendingCommercials, deletedCommercials] = await Promise.all([
      this.commercialsService.getOne(filterQuery, idProjection),
      this.pendingCommercialsService.getOne(filterQuery, idProjection),
      this.deletedCommercialsService.getOne(filterQuery, idProjection),
    ]);

    return Boolean(commercials) || Boolean(pendingCommercials) || Boolean(deletedCommercials);
  }
}
