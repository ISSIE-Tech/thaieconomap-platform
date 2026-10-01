/** **************************************
 * Commercial Tabs
 *************************************** */

export const COMMERCIAL_TABS = {
  RESTAURANT: {
    en: 'restaurants',
    th: 'ร้านอาหาร',
  },
  BUSINESSES: {
    en: 'businesses',
    th: 'ธุรกิจ',
  },
  PUMPUANG: {
    en: 'pumpuang',
    th: 'รถพุ่มพวง',
  },
} as const;
// NOTE: as const is important for easy type safe key check

export const commercialTabs = [
  COMMERCIAL_TABS.RESTAURANT,
  COMMERCIAL_TABS.BUSINESSES,
  COMMERCIAL_TABS.PUMPUANG,
];

/** **************************************
 * App Paths
 *************************************** */

const PATH = {
  AUTH: 'auth',
  ACCOUNT: 'account',
  COMMERCIALS: 'commercials',
  CREATE: 'create',
} as const;

export const paths = {
  roots: '/',
  auth: {
    login: `/${PATH.AUTH}/login`,
  },
  account: {
    root: `/${PATH.ACCOUNT}`,
    profile: `/${PATH.ACCOUNT}/profile`,
    'form-history': `/${PATH.ACCOUNT}/form-history`,
    favorites: `/${PATH.ACCOUNT}/favorites`,
    'my-shops': `/${PATH.ACCOUNT}/my-shops`,
    'my-sharings': `/${PATH.ACCOUNT}/my-sharings`,
    'our-services': `/${PATH.ACCOUNT}/our-services`,
  },
  commercials: {
    restaurants: `/${PATH.COMMERCIALS}/${COMMERCIAL_TABS.RESTAURANT.en}`,
    businesses: `/${PATH.COMMERCIALS}/${COMMERCIAL_TABS.BUSINESSES.en}`,
    pumpuang: `/${PATH.COMMERCIALS}/${COMMERCIAL_TABS.PUMPUANG.en}`,
  },
  shop: (id: string) => `/shops/${id}`,
  jobs: '/job-finding',
  sharings: '/social-sharing',
  create: {
    restaurants: `/${PATH.CREATE}/${COMMERCIAL_TABS.RESTAURANT.en}`,
    businesses: `/${PATH.CREATE}/${COMMERCIAL_TABS.BUSINESSES.en}`,
    shares: `/${PATH.CREATE}/social-sharing`,
  },
  announcements: {
    root: '/announcements',
  },
  about: '/about',
  legal: {
    terms: '/terms',
    privacy: '/privacy',
  },
} as const;
