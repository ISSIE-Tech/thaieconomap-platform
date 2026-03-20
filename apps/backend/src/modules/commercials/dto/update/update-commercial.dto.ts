import { PartialType } from '@nestjs/swagger';

import { CreateCommercialDto } from '../create/create-commercial.dto';

export class UpdateCommercialDto extends PartialType(CreateCommercialDto) {}
