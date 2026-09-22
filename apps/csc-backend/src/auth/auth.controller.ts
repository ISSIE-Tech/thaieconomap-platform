import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './dtos/authenticate.dto';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('authenticate')
  async authenticate(@Body() authenticateDto: AuthenticateDto) {
    const credentials = await this.authService.authenticate(authenticateDto);

    if (!credentials) {
      return {
        statusCode: 200,
        message: 'user not found',
        credentials,
      };
    }

    return {
      statusCode: 200,
      message: 'authenticate successfully',
      credentials,
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const credentials = await this.authService.register(registerDto);
    return {
      statusCode: 201,
      message: 'register successfully',
      credentials,
    };
  }
}
