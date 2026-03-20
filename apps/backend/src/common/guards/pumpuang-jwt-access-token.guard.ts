import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PumpuangJwtAccessGuard extends AuthGuard('pumpuang-jwt-access-token') {}
