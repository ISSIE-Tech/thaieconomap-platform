import { HttpMethod } from '../enums';

export const TAMSANG_TAMSONG_PATH = {
  shops: '/api/v2/openapi/shops',
  bases: '/api/v2/openapi/bases',
};

export const GATEWAY_PATH = {
  getAllPrivilegeUser: {
    path: '/users/privilege-user?service=TEC',
    method: HttpMethod.GET,
  },
  updatePrivilege: {
    path: '/users/privilege-user',
    method: HttpMethod.PATCH,
  },
};

export const THAIBULK_SMS = {
  verify: '/verify',
  request: '/request',
};
