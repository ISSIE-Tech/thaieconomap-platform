import { PartialType } from '@nestjs/swagger';

import { CreatePumpuangDto } from '../create/create-pumpuang.dto';

export class UpdatePumpuangDto extends PartialType(CreatePumpuangDto) {}
