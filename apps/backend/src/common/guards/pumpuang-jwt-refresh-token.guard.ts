import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PumpuangJwtRefreshGuard extends AuthGuard('pumpuang-jwt-refresh-token') {}
