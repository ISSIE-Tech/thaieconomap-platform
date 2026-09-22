import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, QueryOptions } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { BufferedFile } from 'src/minio-client/file.interface';
import { UpdateUserProfileDto } from './dtos/update-user-profile.dto';
import { UserRole } from './schemas/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel({
      ...createUserDto,
    });
    return await user.save();
  }

  async getUsers() {
    return await this.userModel.find({}).populate({
      path: 'districts',
    });
  }

  async getUserById(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user)
      throw new NotFoundException(`ไม่พบผู้ใช้งานที่มีไอดีเป็น ${userId}`);

    return user;
  }

  async getUserByShortId(shortId: string) {
    return await this.getUserByFilters({ shortId });
  }

  async getUserByLineId(lineId: string, isThrow = false) {
    return await this.getUserByFilters({ lineId }, isThrow);
  }

  async getUserByName(name: string) {
    return await this.getUserByFilters({ name });
  }

  private async getUserByFilters(filters: QueryOptions<User>, isThrow = false) {
    const user = await this.userModel.findOne(filters);

    if (!user && isThrow) throw new NotFoundException('the user not found');

    return user;
  }

  async getUserProfile(userId: string) {
    const user = await this.getUserById(userId);
    await user.populate('districts favoritePosts');
    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserDto,
      { new: true },
    );

    return updatedUser;
  }

  // async updateUserProfile(userId: string, updateUserProfileDto: UpdateUserProfileDto) {
  //   const updatedUserProfile = await this.update(userId, updateUserProfileDto)
  //   return updatedUserProfile
  // }

  // async updateUserRole(userId: string, role: UserRole) {
  //   const updatedUser = await this.update(userId, { role })
  //   return updatedUser
  // }

  // async updateUserDistricts
}
