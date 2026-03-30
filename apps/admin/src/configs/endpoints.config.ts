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

export const endpoints = {
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
