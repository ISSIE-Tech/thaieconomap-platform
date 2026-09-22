import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import JwtAccessGuard from 'src/common/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/users/schemas/user-role.enum';
import { UpdateUserRoleDto } from '../dtos/update-user-role.dto';
import { ObjectId } from 'src/common/decorators/object-id.decorator';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDistrictsDto } from '../dtos/update-user-districts.dto';

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(UserRole.Admin)
@Controller('backoffice/users')
export class BackofficeUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    const users = await this.usersService.getUsers();
    return {
      statusCode: 200,
      message: 'get users successfully',
      users,
    };
  }

  // @Get(':userShortId')
  // async getUserByShortId(
  //   @ObjectId('userShortId') userShortId: string
  // ) {
  //   const user = await this.usersService.getUserByShortId(userShortId)
  //   return {
  //     statusCode: 200,
  //     message: 'get user successfully',
  //     user
  //   }
  // }

  // เพิ่ม admin / manager by short id
  @Patch('role')
  async updateUserRole(@Body() { role, shortId }: UpdateUserRoleDto) {
    const user = await this.usersService.getUserByShortId(shortId);
    const updatedUser = await this.usersService.update(user._id.toString(), {
      role,
    });
    return {
      statusCode: 200,
      message: 'update user role successfully',
      user: updatedUser,
    };
  }

  // กำหนดเขตรับผิดชอบ
  @Patch(':userId/districts')
  async updateUserDistricts(
    @Body() { districts }: UpdateUserDistrictsDto,
    @ObjectId('userId') userId: string,
  ) {
    const user = await this.usersService.update(userId, { districts });
    return {
      statusCode: 200,
      message: 'update user districts successfully',
      user,
    };
  }
}
