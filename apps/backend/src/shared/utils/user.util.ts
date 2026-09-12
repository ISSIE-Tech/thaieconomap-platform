import { UserRole } from '@thaieconomap/contracts';
import { IUser } from '../interfaces';

export const isAdminUser = (user: IUser): boolean => {
  return user.roles.TEC === UserRole.ADMIN;
};

export const isManagerUser = (user: IUser): boolean => {
  return user.roles.TEC === UserRole.MANAGER;
};

export const isCustomerUser = (user: IUser): boolean => {
  return user.roles.TEC === UserRole.CUSTOMER;
};

export const checkDistrictPermission = (user: IUser, districtId: string): boolean => {
  if (isAdminUser(user)) {
    return true;
  }

  const isManager = isManagerUser(user);
  const isInDistrict = user.districts.some(
    userDistrict => userDistrict._id.toString() === districtId,
  );

  return isManager && isInDistrict;
};
