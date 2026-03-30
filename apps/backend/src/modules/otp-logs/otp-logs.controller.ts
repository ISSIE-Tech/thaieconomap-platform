import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserRole } from '@thaieconomap/contracts';

import { Roles } from '../../common/decorators/roles.decarotor';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { GetOtpLogsDto } from './dto';
import { OtpLogService } from './services';

@ApiTags('OTP Logs')
@Controller('otp')
export class OtpLogsController {
  constructor(private readonly otpLogService: OtpLogService) {}

  @ApiOperation({ summary: 'Get paginated OTP logs' })
  @ApiOkResponse({ description: 'OTP logs retrieved' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DEVELOPER)
  @Post('logs')
  async getLogs(@Body() dto: GetOtpLogsDto) {
    const page = parseInt(dto.page ?? '1', 10);
    const limit = parseInt(dto.limit ?? '20', 10);

    return this.otpLogService.findLogs(
      { action: dto.action, status: dto.status, phoneNumber: dto.phoneNumber, from: dto.from, to: dto.to },
      page,
      limit,
    );
  }
}
