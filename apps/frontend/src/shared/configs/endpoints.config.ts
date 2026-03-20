import { getValueBasedOnEnv } from '../utils/development';

const ROOTS = {
  AUTH: '/auth',
  SERVICES: '/services',
  THAI_ECONOMAP: '/thai-economap',
  CHIAL_SHARE: '/chial-share',
  COMMERCIALS: '/commercials',
  PUMPUANGS: '/pumpuangs',
  JOBS: '/job-posts',
  SHARES: '/shares',
  MAP: '/map',
  USERS: '/users',
  PENDING_COMMERCIALS: '/pending-commercials',
  PENDING_SHARED: '/pending-shares',
  ANNOUNCEMENTS: '/announcements',
} as const;

// const AUTH = `${ROOTS.AUTH}${ROOTS.THAI_ECONOMAP}`;
const BASE = `${ROOTS.SERVICES}${ROOTS.THAI_ECONOMAP}` as const;
const COMMERCIALS = `${BASE}${ROOTS.COMMERCIALS}`;
const PUMPUANGS = `${BASE}${ROOTS.PUMPUANGS}`;
const JOBS = `${ROOTS.SERVICES}${ROOTS.CHIAL_SHARE}${ROOTS.JOBS}`;
const SHARES = `${BASE}${ROOTS.SHARES}`;
const MAP = `${BASE}${ROOTS.MAP}`;
const USERS = `${BASE}${ROOTS.USERS}`;
const PENDING_COMMERCIALS = `${ROOTS.SERVICES}${ROOTS.THAI_ECONOMAP}${ROOTS.PENDING_COMMERCIALS}`;
const PENGING_SHARED = `${ROOTS.SERVICES}${ROOTS.THAI_ECONOMAP}${ROOTS.PENDING_SHARED}`;
const ANNOUNCEMENTS = `${ROOTS.SERVICES}${ROOTS.THAI_ECONOMAP}${ROOTS.ANNOUNCEMENTS}`;

export const endpoints = {
  auth: {
    line: {
      // url: `${AUTH}/line-login/link`,
      // login: `${AUTH}/line-login/login`,
      link: getValueBasedOnEnv(
        'vDev/auth/thai-economap/line-login/link',
        'v2/auth/thai-economap/line-login/link'
      ),
      login: getValueBasedOnEnv(
        'vDev/auth/thai-economap/line-login/login',
        'v2/auth/thai-economap/line-login/login'
      ),
    },
    refresh: getValueBasedOnEnv(
      'vDev/auth/refresh',
      'v2/auth/refresh'
    ),
    profile: { get: '/users/profile', update: '/users/profile' },
  },
  commercials: {
    list: `${COMMERCIALS}/tiny`,
    filter: (params: string) => `${COMMERCIALS}/tiny/${params}`,
    details: (id: string) => `${COMMERCIALS}/${id}/tiny`,
    pumpuang: {
      filter: (params: string) => `${PUMPUANGS}/tiny/${params}`,
      'product-types': `${BASE}/product-types`,
      detail: (id: string) => `${PUMPUANGS}/${id}`,
      route: (id: string) => `${PUMPUANGS}/${id}/route`,
      // NOTE: favorite without the u (favourite UK, favorite US)
      favorite: (id: string) => `${PUMPUANGS}/${id}/favorite`,
      unfavorite: (id: string) => `${PUMPUANGS}/${id}/unfavorite`,
    },
    create: `${COMMERCIALS}/pending-commercials/upload-additional-image`,
    'restaurant-types': `${BASE}/restaurant-types`,
    'business-types': `${BASE}/business-types`,
    uploadImg: `${PENDING_COMMERCIALS}/upload-additional-image`,
    // NOTE: favorite without the u (favourite UK, favorite US)
    favorite: (id: string) => `${COMMERCIALS}/${id}/favorite`,
    unfavorite: (id: string) => `${COMMERCIALS}/${id}/unfavorite`,
  },
  // TODO: this district doesn't have s
  district: `${MAP}/districts`,
  provinces: `${MAP}/provinces`,
  users: {
    history: `${USERS}/history`,
    favorites: `${USERS}/favorite`,
  },
  pendingCommercials: {
    create: `${PENDING_COMMERCIALS}`,
    update: (id: string) => `${PENDING_COMMERCIALS}/${id}/edit`,
  },
  map: {
    get: `${MAP}/districts`,
  },
  jobs: {
    filter: (params: string) => `${JOBS}/map-mark/${params}`,
    details: (id: string) => `${JOBS}/${id}`,
    'job-types': `${JOBS}/categories`,
  },
  shares: {
    list: `${SHARES}/tiny`,
    filter: (params: Record<string, string>) => addParamsToUrl(`${SHARES}/tiny`, { ...params }),
    details: (id: string) => `${SHARES}/${id}/tiny`,
    types: `${BASE}/share-types`,
    conditions: `${BASE}/condition-options`,
    create: `${PENGING_SHARED}`,
    update: (id: string) => `${PENGING_SHARED}/${id}/edit`,
    uploadImg: `${PENGING_SHARED}/upload-additional-image`,
    favorite: (id: string) => `${SHARES}/${id}/favorite`,
    unfavorite: (id: string) => `${SHARES}/${id}/unfavorite`,
  },
  announcements: {
    list: (params: string) => `${ANNOUNCEMENTS}/tiny/${params}`,
    details: (id: string) => `${ANNOUNCEMENTS}/${id}`,
  },
};

const addParamsToUrl = (url: string, params: Record<string, string>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([param, value]) => {
    searchParams.append(param, value);
  });

  return `${url}?${searchParams.toString()}`;
};
