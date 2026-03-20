import { PartialType } from '@nestjs/swagger';

import { CreatePendingCommercialDto } from '../create/create-pending-commercial.dto';

export class UpdateRejectedPendingCommercialDto extends PartialType(CreatePendingCommercialDto) {}
