import { SetMetadata } from '@nestjs/common';

import { OPTIONAL_AUTH } from '../guards';

export const OptionalAuth = () => SetMetadata(OPTIONAL_AUTH, true);
