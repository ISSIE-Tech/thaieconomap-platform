const BASE = '/services/thai-economap';

export const endpoints = {
  auth: {
    line: {
      link: (env: 'dev' | 'prod' = 'prod') =>
        env === 'dev' ? 'vDev/auth/thai-economap/line-login/link' : 'v2/auth/thai-economap/line-login/link',
      login: (env: 'dev' | 'prod' = 'prod') =>
        env === 'dev' ? 'vDev/auth/thai-economap/line-login/login' : 'v2/auth/thai-economap/line-login/login',
    },
    refresh: (env: 'dev' | 'prod' = 'prod') =>
      env === 'dev' ? 'vDev/auth/refresh' : 'v2/auth/refresh',
  },

  commercials: {
    list: `${BASE}/commercials`,
    tiny: `${BASE}/commercials/tiny`,
    details: (id: string) => `${BASE}/commercials/${id}`,
    detailsTiny: (id: string) => `${BASE}/commercials/${id}/tiny`,
    create: `${BASE}/commercials`,
    update: (id: string) => `${BASE}/commercials/${id}`,
    delete: (id: string) => `${BASE}/commercials/${id}`,
    favorite: (id: string) => `${BASE}/commercials/${id}/favorite`,
    unfavorite: (id: string) => `${BASE}/commercials/${id}/unfavorite`,
  },

  pendingCommercials: {
    list: `${BASE}/pending-commercials`,
    tiny: `${BASE}/pending-commercials/tiny`,
    details: (id: string) => `${BASE}/pending-commercials/${id}`,
    approve: (id: string) => `${BASE}/pending-commercials/${id}/approve`,
    reject: (id: string) => `${BASE}/pending-commercials/${id}/reject`,
  },

  deletedCommercials: {
    list: `${BASE}/deleted-commercials`,
    tiny: `${BASE}/deleted-commercials/tiny`,
  },

  allCommercials: {
    list: `${BASE}/all-commercials`,
  },

  businessTypes: {
    list: `${BASE}/business-types`,
    create: `${BASE}/business-types`,
    delete: (id: string) => `${BASE}/business-types/${id}`,
  },

  restaurantTypes: {
    list: `${BASE}/restaurant-types`,
    create: `${BASE}/restaurant-types`,
    delete: (id: string) => `${BASE}/restaurant-types/${id}`,
  },

  pumpuangs: {
    list: `${BASE}/pumpuangs`,
    tiny: `${BASE}/pumpuangs/tiny`,
    details: (id: string) => `${BASE}/pumpuangs/${id}`,
    create: `${BASE}/pumpuangs`,
    update: (id: string) => `${BASE}/pumpuangs/${id}`,
    delete: (id: string) => `${BASE}/pumpuangs/${id}`,
    favorite: (id: string) => `${BASE}/pumpuangs/${id}/favorite`,
    unfavorite: (id: string) => `${BASE}/pumpuangs/${id}/unfavorite`,
    route: (id: string) => `${BASE}/pumpuangs/${id}/route`,
  },

  pendingPumpuangs: {
    list: `${BASE}/pending-pumpuangs`,
    tiny: `${BASE}/pending-pumpuangs/tiny`,
    details: (id: string) => `${BASE}/pending-pumpuangs/${id}`,
    approve: (id: string) => `${BASE}/pending-pumpuangs/${id}/approve`,
    reject: (id: string) => `${BASE}/pending-pumpuangs/${id}/reject`,
  },

  deletedPumpuangs: {
    list: `${BASE}/deleted-pumpuangs`,
    tiny: `${BASE}/deleted-pumpuangs/tiny`,
  },

  allPumpuangs: {
    list: `${BASE}/all-pumpuangs`,
  },

  productTypes: {
    list: `${BASE}/product-types`,
    create: `${BASE}/product-types`,
    delete: (id: string) => `${BASE}/product-types/${id}`,
  },

  shares: {
    list: `${BASE}/shares`,
    tiny: `${BASE}/shares/tiny`,
    details: (id: string) => `${BASE}/shares/${id}`,
    create: `${BASE}/shares`,
    update: (id: string) => `${BASE}/shares/${id}`,
    delete: (id: string) => `${BASE}/shares/${id}`,
    favorite: (id: string) => `${BASE}/shares/${id}/favorite`,
    unfavorite: (id: string) => `${BASE}/shares/${id}/unfavorite`,
  },

  pendingShares: {
    list: `${BASE}/pending-shares`,
    tiny: `${BASE}/pending-shares/tiny`,
    details: (id: string) => `${BASE}/pending-shares/${id}`,
    approve: (id: string) => `${BASE}/pending-shares/${id}/approve`,
    reject: (id: string) => `${BASE}/pending-shares/${id}/reject`,
  },

  deletedShares: {
    list: `${BASE}/deleted-shares`,
    tiny: `${BASE}/deleted-shares/tiny`,
  },

  allShares: {
    list: `${BASE}/all-shares`,
  },

  shareTypes: {
    list: `${BASE}/share-types`,
    create: `${BASE}/share-types`,
    delete: (id: string) => `${BASE}/share-types/${id}`,
  },

  conditionOptions: {
    list: `${BASE}/condition-options`,
    create: `${BASE}/condition-options`,
    delete: (id: string) => `${BASE}/condition-options/${id}`,
  },

  shippingOptions: {
    list: `${BASE}/shipping-options`,
    create: `${BASE}/shipping-options`,
    delete: (id: string) => `${BASE}/shipping-options/${id}`,
  },

  announcements: {
    list: `${BASE}/announcements`,
    tiny: `${BASE}/announcements/tiny`,
    details: (id: string) => `${BASE}/announcements/${id}`,
    create: `${BASE}/announcements`,
    update: (id: string) => `${BASE}/announcements/${id}`,
    delete: (id: string) => `${BASE}/announcements/${id}`,
  },

  users: {
    me: `${BASE}/users/me`,
    favorites: `${BASE}/users/favorites`,
    history: `${BASE}/users/history`,
    privilegeUsers: `${BASE}/users/privilege-user`,
    privilegeUser: (id: string) => `${BASE}/users/privilege-user/${id}`,
    districts: (id: string) => `${BASE}/users/${id}/districts`,
  },

  map: {
    districts: `${BASE}/districts`,
  },

  notifications: {
    send: `${BASE}/notifications/send`,
    sendTopic: `${BASE}/notifications/send-topic`,
    updateToken: `${BASE}/notifications/token`,
    removeToken: `${BASE}/notifications/token`,
  },
};
