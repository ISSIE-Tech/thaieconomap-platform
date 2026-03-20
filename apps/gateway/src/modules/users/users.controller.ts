import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';

import { Express } from 'express';

import { CurrentUser, Roles } from '../../common/decorators';
import { ApiKeyGuard, JwtAccessGuard } from '../../common/guards';
import { ProfileImageInterceptor } from '../../common/interceptors';
import { FileValidationPipe } from '../../common/pipes';
import { maxFileSize, privilegeRoleList, supportedMimeTypes } from '../../shared/constants';
import { BackofficeServiceDto } from '../../shared/dto';
import { UserRole } from '../../shared/enums';
import { IDisplayUserRole } from '../../shared/interfaces';

import { UpdatePrivilegeUserDto, UpdateProfileDto } from './dto';
import { UserDocument } from './schemas';
import { UsersService } from './users.service';

@UseInterceptors(ProfileImageInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ status: 200, description: 'Return list of user roles.' })
  @ApiResponse({ status: 403, description: 'For `ADMIN` role only.' })
  @Get('privilege-user/roles')
  @UseGuards(JwtAccessGuard)
  @Roles(UserRole.ADMIN)
  getPrivilegeRoles(@Query() backofficeServiceDto: BackofficeServiceDto): IDisplayUserRole[] {
    return privilegeRoleList.get(backofficeServiceDto.service) || [];
  }

  @ApiResponse({ status: 200, description: 'Return list of privilege user.' })
  @ApiResponse({ status: 403, description: 'For `ADMIN` role only.' })
  @ApiResponse({ status: 500, description: 'Failed on finding user in database.' })
  @Get('privilege-user')
  @UseGuards(ApiKeyGuard)
  async getAllPrivilegeUser(
    @Query() backofficeServiceDto: BackofficeServiceDto,
  ): Promise<UserDocument[]> {
    return this.usersService.findAllPrivilegeUser(backofficeServiceDto);
  }

  @ApiResponse({ status: 200, description: 'Return user profile detail.' })
  @ApiResponse({ status: 401, description: 'Invalid `accessToken`.' })
  @Get('profile')
  @UseGuards(JwtAccessGuard)
  getProfile(@CurrentUser() user: UserDocument): UserDocument {
    user.refreshToken = undefined;

    return user;
  }

  @ApiResponse({ status: 200, description: 'Return updated user profile detail.' })
  @ApiResponse({ status: 400, description: 'Incoming file not match with file policy' })
  @ApiResponse({ status: 401, description: 'Invalid `accessToken`.' })
  @Patch('profile')
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateProfile(
    @CurrentUser() user: UserDocument,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(new FileValidationPipe(supportedMimeTypes, maxFileSize))
    profileImage: Express.Multer.File,
  ): Promise<UserDocument> {
    if (!Object.keys(updateProfileDto).length && !profileImage) {
      user.refreshToken = undefined;

      return user;
    }

    return this.usersService.updateProfile(user, updateProfileDto, profileImage);
  }

  @ApiResponse({ status: 200, description: 'Promote a user with `shortId` to privilige user.' })
  @ApiResponse({ status: 400, description: 'Incoming file not match with file policy' })
  @ApiResponse({ status: 401, description: 'Invalid `api key`' })
  @Patch('privilege-user/:shortId')
  @UseGuards(ApiKeyGuard)
  async updatePrivilegeUser(
    @Body() updatePrivilegeUserDto: UpdatePrivilegeUserDto,
    @Param('shortId') shortId: string,
  ): Promise<UserDocument> {
    return this.usersService.updatePrivilegeUser(shortId, updatePrivilegeUserDto);
  }
}
