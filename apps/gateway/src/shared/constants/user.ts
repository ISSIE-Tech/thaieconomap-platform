import { BackofficeService, UserRole } from '../enums';
import { IDisplayUserRole } from '../interfaces';

export const privilegeRoleList = new Map<BackofficeService, IDisplayUserRole[]>([
  [
    BackofficeService.TEC,
    [
      {
        display: 'ผู้ดูแลระบบ',
        role: UserRole.ADMIN,
      },
      {
        display: 'ผู้จัดการ',
        role: UserRole.MANAGER,
      },
    ],
  ],
  [
    BackofficeService.CSC,
    [
      {
        display: 'ผู้ดูแลระบบ',
        role: UserRole.ADMIN,
      },
      {
        display: 'ผู้จัดการ',
        role: UserRole.MANAGER,
      },
    ],
  ],
]);
