import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiResponse({ status: 200, description: 'Service running properly.' })
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
