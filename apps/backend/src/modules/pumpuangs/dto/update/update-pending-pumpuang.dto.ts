import { PartialType } from '@nestjs/swagger';

import { CreatePendingPumpuangDto } from '../create/create-pending-pumpuang.dto';

export class UpdatePendingPumpuangDto extends PartialType(CreatePendingPumpuangDto) {}
