import { PartialType } from '@nestjs/swagger';

import { CreatePendingShareDto } from '../create/create-pending-share.dto';

export class UpdateRejectedPendingShareDto extends PartialType(CreatePendingShareDto) {}
