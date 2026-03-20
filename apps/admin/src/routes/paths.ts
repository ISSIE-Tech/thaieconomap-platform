// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  ECONOMAP: '/economap',
  COMMERCIAL: `/commercial`,
  SOCIAL_SHARING: `/social-sharing`,
  ANNOUNCEMENTS: '/announcements',
  USER: `/manager`,
  PUMPURANG: '/pumpuang',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/line`,
  },
  // DASHBOARD
  user: {
    dashboard: {
      root: `${ROOTS.DASHBOARD}${ROOTS.USER}`,
      new: `${ROOTS.DASHBOARD}${ROOTS.USER}/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}${ROOTS.USER}/edit/${id}`,
    },
  },
  commercial: {
    dashboard: {
      root: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.COMMERCIAL}`,
      list: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.COMMERCIAL}/list`,
      pending: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.COMMERCIAL}/pending`,
      new: {
        root: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.COMMERCIAL}/new`,
        restaurant: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.COMMERCIAL}/new/restaurants`,
        business: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.COMMERCIAL}/new/business`,
      },
      types: {
        root: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.COMMERCIAL}/types`,
        restaurant: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.COMMERCIAL}/types/restaurants`,
        business: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.COMMERCIAL}/types/business`,
      },
      edit: (id: string) => `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.COMMERCIAL}/edit/${id}`,
    },
  },
  'social-sharing': {
    dashboard: {
      root: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.SOCIAL_SHARING}`,
      list: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.SOCIAL_SHARING}/list`,
      pending: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.SOCIAL_SHARING}/pending`,
      new: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.SOCIAL_SHARING}/new`,
      deleted: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.SOCIAL_SHARING}/deleted`,
      edit: (id: string) => `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.SOCIAL_SHARING}/edit/${id}`,
      conditions:`${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.SOCIAL_SHARING}/options/conditions`,
    },
  },
  announcements: {
    dashboard: {
      root: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.ANNOUNCEMENTS}`,
      list: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.ANNOUNCEMENTS}/list`,
      pending: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.ANNOUNCEMENTS}/pending`,
      new: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.ANNOUNCEMENTS}/new`,
      deleted: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.ANNOUNCEMENTS}/deleted`,
      edit: (id: string) => `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.ANNOUNCEMENTS}/edit/${id}`,
    },
  },
  pumpuang: {
    dashboard: {
      root: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.PUMPURANG}`,
      list: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.PUMPURANG}/list`,
      types: `${ROOTS.DASHBOARD}${ROOTS.ECONOMAP}${ROOTS.PUMPURANG}/types`,
    },
  },
};
