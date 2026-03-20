import type { UserResponseDto } from '@thaieconomap/contracts';

export type User = Pick<UserResponseDto, '_id' | 'name' | 'email' | 'profileImageUrl'> & {
  roles: string[];
  oauth: string;
};
