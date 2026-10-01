import { HttpMethod } from '@thaieconomap/contracts';

export const TAMSANG_TAMSONG_PATH = {
  shops: '/api/thaieconomap/shops',
  bases: '/api/thaieconomap/bases',
};

// public csc-backend endpoints, the same ones the job map used to call through the gateway
export const CHIAL_SHARE_PATH = {
  mapMarks: '/job-posts/map-mark',
  categories: '/job-posts/categories',
  jobPost: (id: string) => `/job-posts/${id}`,
};

export const TAMSANG_TAMSONG_OPEN_API_KEY_HEADER = 'open-api-key';

// perPage is capped at 100 by the tamsang-tamsong open api
export const TAMSANG_TAMSONG_PER_PAGE = 100;

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
