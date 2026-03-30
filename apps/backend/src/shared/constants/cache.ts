export const CACHE_KEY = {
  pumpuang: {
    otp: (pumpuangId: string) => `pumpuang:otp:${pumpuangId}`,
    location: (pumpuangId: string) => `pumpuang:location:${pumpuangId}`,
    session: (sessionId: string) => `pumpuang:session:${sessionId}`,
    notifOpen: (pumpuangId: string, date: string) => `pumpuang:notif:open:${pumpuangId}:${date}`,
    notifClose: (pumpuangId: string, date: string) => `pumpuang:notif:close:${pumpuangId}:${date}`,
    notifCloseFollowup: (pumpuangId: string, date: string) =>
      `pumpuang:notif:close-followup:${pumpuangId}:${date}`,
  },
  commercials: {
    all: 'commercials:*',
    prefix: 'commercials',
    tiny: 'commercials:/commercials/tiny:*',
  },
  pendingCommercials: {
    all: 'pending_commercials:*',
    prefix: 'pending_commercials',
    tiny: 'pending_commercials:/pending-commercials/tiny:*',
  },
  deletedCommercials: {
    all: 'deleted_commercials:*',
    prefix: 'deleted_commercials',
    tiny: 'deleted_commercials:/deleted-commercials/tiny:*',
  },
  allCommercials: {
    all: 'all-commercials:*',
    prefix: 'all-commercials',
  },
  businessTypes: {
    all: 'business_types:*',
    prefix: 'business_types',
  },
  restaurantTypes: {
    all: 'restaurant_types:*',
    prefix: 'restaurant_types',
  },
  shares: {
    all: 'shares:*',
    prefix: 'shares',
    tiny: 'shares:/shares/tiny:',
  },
  pendingShares: {
    all: 'pending_shares:*',
    prefix: 'pending_shares',
    tiny: 'pending_shares:/pending-shares/tiny:*',
  },
  deletedShares: {
    all: 'deleted_shares:*',
    prefix: 'deleted_shares',
    tiny: 'deleted_shares:/deleted-shares/tiny:*',
  },
  allShares: {
    all: 'all-shares:*',
    prefix: 'all-shares',
  },
  conditionOptions: {
    all: 'condition_options:*',
    prefix: 'condition_options:',
  },
  shareTypes: {
    all: 'share_types:*',
    prefix: 'share_types:',
  },
  shippingOptions: {
    all: 'shipping_options:*',
    prefix: 'shipping_options:',
  },
  map: {
    prefix: 'map',
  },
};

export const REDIS_INDEX_NAME = {
  pumpuang: {
    location: 'pumpuangLocationIndex',
    session: 'pumpuangSessionIndex',
  },
};
