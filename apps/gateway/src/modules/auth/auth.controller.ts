import { Body, Controller, Get, Post, UseGuards, UseInterceptors, Version } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators';
import { JwtAccessGuard, JwtRefreshGuard, ProtectedEndpoint } from '../../common/guards';
import { ProfileImageInterceptor } from '../../common/interceptors';
import { Service } from '../../shared/enums';
import { IAuthResponse, ICredentials } from '../../shared/interfaces';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 200, description: 'Return **ByPassJa** user profile and credentials.' })
  @ApiResponse({ status: 404, description: 'For `develop` only.' })
  @ApiResponse({ status: 500, description: 'Failed on finding user in mongoDB.' })
  @UseGuards(ProtectedEndpoint)
  @UseInterceptors(ProfileImageInterceptor)
  @Post('/bypass')
  bypassLogin(@Body() _authorizationCode: LoginDto) {
    return this.authService.bypassLogin();
  }

  @ApiResponse({
    status: 200,
    description:
      'Return line login page url. Redirect to http://thaieconomap.lakeikeda.xyz/account',
  })
  @Get('/thai-economap/line-login/link')
  getThaiEconomapLineLoginLink(): string {
    return this.authService.getLineLoginLink(Service.TEC);
  }

  @ApiResponse({
    status: 200,
    description:
      'Return line login page url. Redirect to http://thaieconomap-client.dev.lakeikeda.xyz/auth/callback/line',
  })
  @Version('2')
  @Get('/thai-economap/line-login/link')
  getThaiEconomapLineLoginV2Link(): string {
    return this.authService.getLineLoginLink(Service.TEC_V2);
  }

  @ApiResponse({
    status: 200,
    description: 'Return line login page url. Redirect to http://localhost:3000/auth/callback/line',
  })
  @UseGuards(ProtectedEndpoint)
  @Version('Dev')
  @Get('/thai-economap/line-login/link')
  getThaiEconomapLineLoginDevLink(): string {
    return this.authService.getLineLoginLink(Service.DEV);
  }

  @ApiResponse({
    status: 200,
    description:
      'Return line login page url for admin dashboard domain. Redirect to https://economap-admin.dev.lakeikeda.xyz/auth/callback/line',
  })
  @Get('/thai-economap-admin/line-login/link')
  getThaiEconomapAdminLineLoginLink(): string {
    return this.authService.getLineLoginLink(Service.TEC_ADMIN);
  }

  @ApiResponse({ status: 200, description: 'Return user profile and credentials.' })
  @ApiResponse({ status: 400, description: 'Email used from other oauth provider.' })
  @ApiResponse({ status: 500, description: 'Create or update user data failed.' })
  @ApiResponse({ status: 503, description: 'Invalid authorization code' })
  @ApiResponse({ status: 503, description: 'Failed on get profile from line provider.' })
  @Post('/thai-economap/line-login/login')
  @UseInterceptors(ProfileImageInterceptor)
  async thaieconomapLineLoginCallback(@Body() loginDto: LoginDto): Promise<IAuthResponse> {
    return this.authService.lineLogin(loginDto.authorizationCode, Service.TEC);
  }

  @ApiResponse({ status: 200, description: 'Return user profile and credentials.' })
  @ApiResponse({ status: 400, description: 'Email used from other oauth provider.' })
  @ApiResponse({ status: 500, description: 'Create or update user data failed.' })
  @ApiResponse({ status: 503, description: 'Invalid authorization code' })
  @ApiResponse({ status: 503, description: 'Failed on get profile from line provider.' })
  @Version('2')
  @Post('/thai-economap/line-login/login')
  @UseInterceptors(ProfileImageInterceptor)
  async thaieconomapLineLoginV2Callback(@Body() loginDto: LoginDto): Promise<IAuthResponse> {
    return this.authService.lineLogin(loginDto.authorizationCode, Service.TEC_V2);
  }

  @ApiResponse({ status: 200, description: 'Return user profile and credentials.' })
  @ApiResponse({ status: 400, description: 'Email used from other oauth provider.' })
  @ApiResponse({ status: 404, description: 'For `develop` only.' })
  @ApiResponse({ status: 500, description: 'Create or update user data failed.' })
  @ApiResponse({ status: 503, description: 'Invalid authorization code' })
  @ApiResponse({ status: 503, description: 'Failed on get profile from line provider.' })
  @UseGuards(ProtectedEndpoint)
  @Version('Dev')
  @Post('/thai-economap/line-login/login')
  @UseInterceptors(ProfileImageInterceptor)
  async thaieconomapLineLoginDevCallback(@Body() loginDto: LoginDto): Promise<IAuthResponse> {
    return this.authService.lineLogin(loginDto.authorizationCode, Service.DEV);
  }

  @ApiResponse({ status: 200, description: 'Return user profile and credentials.' })
  @ApiResponse({ status: 400, description: 'Email used from other oauth provider.' })
  @ApiResponse({ status: 403, description: 'For `ADMIN` role only.' })
  @ApiResponse({ status: 500, description: 'Create or update user data failed.' })
  @ApiResponse({ status: 503, description: 'Invalid authorization code' })
  @ApiResponse({ status: 503, description: 'Failed on get profile from line provider.' })
  @Post('/thai-economap-admin/line-login/login')
  @UseInterceptors(ProfileImageInterceptor)
  async thaieconomapAdminLineLoginCallback(@Body() loginDto: LoginDto): Promise<IAuthResponse> {
    return this.authService.lineLogin(loginDto.authorizationCode, Service.TEC_ADMIN);
  }

  @ApiResponse({
    status: 200,
    description: 'Return Authentik OIDC login page url for admin dashboard.',
  })
  @Get('/thai-economap-admin/authentik/link')
  getAuthentikLoginLink(): string {
    return this.authService.getAuthentikLoginLink();
  }

  @ApiResponse({ status: 200, description: 'Return user profile and credentials.' })
  @ApiResponse({ status: 400, description: 'Email used from other oauth provider.' })
  @ApiResponse({ status: 403, description: 'User does not have required OIDC group.' })
  @ApiResponse({ status: 500, description: 'Create or update user data failed.' })
  @ApiResponse({ status: 503, description: 'Invalid authorization code.' })
  @Post('/thai-economap-admin/authentik/login')
  @UseInterceptors(ProfileImageInterceptor)
  async authentikLoginCallback(@Body() loginDto: LoginDto): Promise<IAuthResponse> {
    return this.authService.authentikLogin(loginDto.authorizationCode);
  }

  @ApiResponse({
    status: 200,
    description:
      'Return facebook login page url. Redirect to http://localhost:5000/auth/facebook-login/callback',
  })
  @Get('/facebook-login/link')
  getFacebookLoginLink(): string {
    return this.authService.getFacebookLoginLink();
  }

  @ApiResponse({ status: 200, description: 'Return user profile and credentials.' })
  @ApiResponse({ status: 400, description: 'Email used from other oauth provider.' })
  @ApiResponse({ status: 403, description: 'For `ADMIN` role only.' })
  @ApiResponse({ status: 500, description: 'Create or update user data failed.' })
  @ApiResponse({ status: 503, description: 'Invalid authorization code' })
  @ApiResponse({ status: 503, description: 'Failed on get profile from facebook provider.' })
  @UseInterceptors(ProfileImageInterceptor)
  @Post('/facebook-login/login')
  async facebookLoginCallback(@Body() loginDto: LoginDto): Promise<IAuthResponse> {
    return this.authService.facebookLogin(loginDto.authorizationCode);
  }

  @ApiResponse({ status: 200, description: 'Refreshed user credentials. Return new credentials' })
  @ApiResponse({ status: 400, description: 'Invalid `_id`.' })
  @ApiResponse({ status: 401, description: 'Invalid `refreshToken`.' })
  @ApiResponse({ status: 500, description: 'Update user refresh token failed.' })
  @ApiBody({
    schema: {
      example: { refreshToken: 'here refresh token u want' },
    },
  })
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshAccessToken(
    @CurrentUser('_id') userId: string,
    @Body('refreshToken') refreshToken: string,
  ): Promise<ICredentials> {
    return this.authService.generateCredential(userId, refreshToken);
  }

  @ApiResponse({ status: 200, description: 'Revoked user credentials.' })
  @ApiResponse({ status: 400, description: 'Invalid `_id`.' })
  @ApiResponse({ status: 403, description: 'Invalid `accessToken`.' })
  @ApiResponse({ status: 500, description: 'Clear user refresh token failed.' })
  @Post('revoke')
  @UseGuards(JwtAccessGuard)
  async revokeToken(@CurrentUser('_id') userId: string) {
    await this.authService.revokeToken(userId);
  }
}
