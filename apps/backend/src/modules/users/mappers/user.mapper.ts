import { UserResponseDto } from '@thaieconomap/contracts';

import { IUser } from '../../../shared/interfaces';
import { toRef } from '../../../shared/utils/ref.util';

export class UserMapper {
  static toResponseDto(doc: IUser): UserResponseDto {
    return {
      _id: doc._id?.toString(),
      shortId: doc.shortId,
      authId: doc.authId?.toString(),
      email: doc.email,
      name: doc.name,
      displayName: doc.displayName,
      profileImageUrl: doc.profileImageUrl,
      roles: doc.roles,
      districts: doc.districts?.map(toRef),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
