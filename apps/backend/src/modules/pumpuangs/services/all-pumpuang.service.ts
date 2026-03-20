import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { FilterQuery } from 'mongoose';

import { AllSharesService } from '../../../modules/shares/services';
import { IAllPumpuang, IUser } from '../../../shared/interfaces';
import { prettyObjectString } from '../../../shared/utils';

import { DeletedPumpuangsService } from './deleted-pumpuangs.service';
import { PendingPumpuangsService } from './pending-pumpuangs.service';
import { PumpuangsService } from './pumpuang.service';

@Injectable()
export class AllPumpuangsService {
  private readonly logger: Logger = new Logger(AllPumpuangsService.name);

  constructor(
    @Inject(forwardRef(() => PumpuangsService))
    private readonly pumpuangsService: PumpuangsService,

    @Inject(forwardRef(() => PendingPumpuangsService))
    private readonly pendingPumpuangsService: PendingPumpuangsService,

    @Inject(forwardRef(() => DeletedPumpuangsService))
    private readonly deletedPumpuangsService: DeletedPumpuangsService,
  ) {}

  async getAll(user: IUser): Promise<IAllPumpuang[]> {
    this.logger.debug(
      `{${AllSharesService.name}-${this.getAll.name}} (called)\
            \n[param] ${prettyObjectString({
              roles: user?.roles,
            })}`,
    );

    const [pumpuangs, pendingPumpuangs, deletedPumpuangs] = await Promise.all([
      this.pumpuangsService.getAllPumpuang(),
      this.pendingPumpuangsService.getAllPendingPumpuang(),
      this.deletedPumpuangsService.getAllDeletedPumpuang(),
    ]);

    return [...pumpuangs, ...pendingPumpuangs, ...deletedPumpuangs];
  }

  async isPumpuangExists(filterQuery: FilterQuery<IAllPumpuang>): Promise<boolean> {
    this.logger.debug(
      `{${AllSharesService.name}-${this.isPumpuangExists.name}} (called)\
          \n[param] ${prettyObjectString({
            filterQuery,
          })}`,
    );

    const idProjection = { _id: 1 };
    const [pumpuangs, pendingPumpuangs, deletedPumpuangs] = await Promise.all([
      this.pumpuangsService.getOne(filterQuery, idProjection),
      this.pendingPumpuangsService.getOne(filterQuery, idProjection),
      this.deletedPumpuangsService.getOne(filterQuery, idProjection),
    ]);

    return Boolean(pumpuangs) || Boolean(pendingPumpuangs) || Boolean(deletedPumpuangs);
  }
}
