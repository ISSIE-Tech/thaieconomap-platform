import { getValueBasedOnEnv } from 'src/utils/development';

// ----------------------------------------------------------------------

const auth = {
  dev: {
    link: '/auth/thai-economap-admin/line-login/link',
    login: '/auth/thai-economap-admin/line-login/login',
  },
  prod: {
    link: '/auth/thai-economap-admin/line-login/link',
    login: '/auth/thai-economap-admin/line-login/login',
  },
};

const authentikAuth = {
  dev: {
    link: '/auth/thai-economap-admin/authentik/link',
    login: '/auth/thai-economap-admin/authentik/login',
  },
  prod: {
    link: '/auth/thai-economap-admin/authentik/link',
    login: '/auth/thai-economap-admin/authentik/login',
  },
};

// ----------------------------------------------------------------------

const CSC = '/services/chial-share';
const cscScope = (isAdmin: boolean) => (isAdmin ? 'admin' : 'manager');

const csc = {
  jobs: {
    active: {
      list: (isAdmin: boolean) => `${CSC}/backoffice/job-posts/${cscScope(isAdmin)}`,
      byId: (id: string) => `${CSC}/backoffice/job-posts/${id}`,
      update: (id: string) => `${CSC}/backoffice/job-posts/${id}`,
      recycle: (id: string) => `${CSC}/backoffice/job-posts/${id}/recycle`,
    },
    pending: {
      list: (isAdmin: boolean) => `${CSC}/backoffice/pending-job-posts/${cscScope(isAdmin)}`,
      byId: (id: string) => `${CSC}/backoffice/pending-job-posts/${id}`,
      approve: (id: string) => `${CSC}/backoffice/pending-job-posts/${id}/approve`,
      reject: (id: string) => `${CSC}/backoffice/pending-job-posts/${id}/reject`,
    },
    deleted: {
      list: (_isAdmin: boolean) => `${CSC}/backoffice/deleted-job-posts/all`,
      byId: (id: string) => `${CSC}/backoffice/deleted-job-posts/${id}`,
      restore: (id: string) => `${CSC}/backoffice/deleted-job-posts/${id}/restore`,
    },
  },
  jobCategories: {
    root: `${CSC}/backoffice/job-categories`,
    arrange: `${CSC}/backoffice/job-categories/arrange`,
    byId: (id: string) => `${CSC}/backoffice/job-categories/${id}`,
    update: (id: string) => `${CSC}/backoffice/job-categories/${id}`,
  },
  wageUnits: {
    root: `${CSC}/backoffice/wage-units`,
    byId: (id: string) => `${CSC}/backoffice/wage-units/${id}`,
  },
  users: {
    root: `${CSC}/backoffice/users`,
    role: `${CSC}/backoffice/users/role`,
    districts: (id: string) => `${CSC}/backoffice/users/${id}/districts`,
  },
  districts: `${CSC}/districts`,
};

// ----------------------------------------------------------------------

export const endpoints = {
  csc,
  auth: {
    line: {
      link: getValueBasedOnEnv(auth.dev.link, auth.prod.link),
      login: getValueBasedOnEnv(auth.dev.login, auth.prod.login),
    },
    authentik: {
      link: getValueBasedOnEnv(authentikAuth.dev.link, authentikAuth.prod.link),
      login: getValueBasedOnEnv(authentikAuth.dev.login, authentikAuth.prod.login),
    },
    refresh: getValueBasedOnEnv('vDev/auth/refresh', '/auth/refresh'),
    profile: '/users/profile',
  },
  manager: {
    list: '/services/thai-economap/users/privilege-user/',
    districts: (id: string) => `/services/thai-economap/users/${id}/districts`,
    register: (id: string) => `/services/thai-economap/users/privilege-user/${id}`,
    update: '/users/profile',
  },
  commercial: {
    list: '/services/thai-economap/all-commercials',
    approve: (id: string) => `/services/thai-economap/pending-commercials/${id}/approve`,
    reject: (id: string) => `/services/thai-economap/pending-commercials/${id}/reject`,
    delete: (id: string) => `/services/thai-economap/commercials/${id}`,
    create: `/services/thai-economap/commercials`,
    update: (id: string) => `/services/thai-economap/commercials/${id}`,
    uploadImg: `/services/thai-economap/commercials/upload-additional-image`,
  },
  'pending-commercial': {
    update: (id: string) => `/services/thai-economap/pending-commercials/${id}`,
    uploadImg: `/services/thai-economap/pending-commercials/upload-additional-image`,
  },
  restaurant: {
    types: '/services/thai-economap/restaurant-types',
  },
  business: {
    types: '/services/thai-economap/business-types',
  },
  district: {
    list: '/services/thai-economap/map/districts',
  },
  'social-sharing': {
    list: '/services/thai-economap/all-shares/',
    approve: (id: string) => `/services/thai-economap/pending-shares/${id}/approve`,
    reject: (id: string) => `/services/thai-economap/pending-shares/${id}/reject`,
    delete: (id: string) => `/services/thai-economap/shares/${id}`,
    create: '/services/thai-economap/shares',
    types: '/services/thai-economap/share-types',
    conditions: `/services/thai-economap/condition-options`,
    update: (id: string) => `/services/thai-economap/shares/${id}`,
    uploadImg: `/services/thai-economap/shares/upload-additional-image`,
  },
  'pending-social-sharing': {
    update: (id: string) => `/services/thai-economap/pending-shares/${id}`,
    uploadImg: `/services/thai-economap/pending-shares/upload-additional-image`,
  },
  announcements: {
    create: '/services/thai-economap/announcements',
    update: (id: string) => `/services/thai-economap/announcements/${id}`,
    getById: (id: string) => `/services/thai-economap/announcements/${id}`,
    getAll: `/services/thai-economap/announcements/`,
  },
  otp: {
    logs: '/services/thai-economap/otp/logs',
  },
  caching: {
    sync: '/services/thai-economap/caching/sync',
    shops: '/services/thai-economap/caching/shops',
    syncLogs: '/services/thai-economap/caching/sync-logs',
  },
  notifications: {
    logs: '/services/thai-economap/notifications/logs',
    tokenCounts: '/services/thai-economap/notifications/token-counts',
    testSend: '/services/thai-economap/notifications/test-send',
  },
  pumpuang: {
    list: '/services/thai-economap/all-pumpuangs',
    approve: (id: string) => `/services/thai-economap/pending-pumpuangs/${id}/approve`,
    reject: (id: string) => `/services/thai-economap/pending-pumpuangs/${id}/reject`,
    delete: (id: string) => `/services/thai-economap/pumpuangs/${id}`,
    create: '/services/thai-economap/pumpuangs',
    update: (id: string) => `/services/thai-economap/pumpuangs/${id}`,
    getById: (id: string) => `/services/thai-economap/pumpuangs/${id}`,
    route: (id: string) => `/services/thai-economap/pumpuangs/${id}/route`,
    uploadImg: '/services/thai-economap/pumpuangs/upload-additional-image',
    deleteImg: (id: string) => `/services/thai-economap/pumpuangs/${id}/delete-additional-image`,
    forceStop: (id: string) => `/services/thai-economap/pumpuangs/${id}/force-stop`,
    types: {
      list: '/services/thai-economap/product-types',
      create: '/services/thai-economap/product-types',
      delete: (id: string) => `/services/thai-economap/product-types/${id}`,
    },
  },
};
