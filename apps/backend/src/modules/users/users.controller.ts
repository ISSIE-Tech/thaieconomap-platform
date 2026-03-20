import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { FavoriteListResponseDto, UserResponseDto, UserRole } from '@thaieconomap/contracts';

import { CurrentUser, Roles } from '../../common/decorators';
import { AuthGuard, RolesGuard } from '../../common/guards';
import { TransformFileInterceptor } from '../../common/interceptors';
import { DOC_DESCRIPTION } from '../../shared/constants';
import { IHistory } from '../../shared/interfaces';

import { UpdatePrivilegeUserDto } from './dto';
import { GetFavoriteDto } from './dto/get-favorite.dto';
import { UserMapper } from './mappers';
import { User } from './schemas';
import { FavoriteService, UsersService } from './services';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: DOC_DESCRIPTION.INVALID_TOKEN,
})
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly favoriteService: FavoriteService,
  ) {}

  @ApiOkResponse({ description: 'Return array of all privilege user' })
  @ApiForbiddenResponse({
    description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN),
  })
  @Get('privilege-user')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getPrivilegeAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.usersService.getPrivilegeAllUsers();

    return users.map(UserMapper.toResponseDto);
  }

  @ApiOkResponse({ description: 'Return array of user history' })
  @UseInterceptors(TransformFileInterceptor)
  @UseGuards(AuthGuard)
  @Get('history')
  async getHistory(@CurrentUser('_id') userId: string): Promise<IHistory[]> {
    return this.usersService.getHistoryByUserId(userId);
  }

  @ApiOkResponse({ description: 'Update user responsible district' })
  @ApiForbiddenResponse({
    description: DOC_DESCRIPTION.INCLUDE_ROLES(UserRole.ADMIN),
  })
  @ApiNotFoundResponse({
    description: DOC_DESCRIPTION.ENTITY_NOT_FOUND(User.name),
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('privilege-user/:shortId')
  async updateUserDistrict(
    @Param('shortId') shortId: string,
    @Body() updatePrivilegeUserDto: UpdatePrivilegeUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.updatePrivilegeUser(shortId, updatePrivilegeUserDto);

    return UserMapper.toResponseDto(user);
  }

  @ApiOkResponse({ description: 'Return array of user favorite unit.' })
  @ApiBadRequestResponse({
    description: DOC_DESCRIPTION.INVALID_REQ_BODY(GetFavoriteDto.name),
  })
  @UseGuards(AuthGuard)
  @Get('favorite')
  async getUserFavoriteList(
    @CurrentUser('_id') userId: string,
    @Query() getFavoriteDto: GetFavoriteDto,
  ): Promise<FavoriteListResponseDto> {
    return this.favoriteService.getFavoriteByUserId(userId, getFavoriteDto);
  }
}
