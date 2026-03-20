export type FavoriteTiny = {
  _id: string;
  name: string;
  address: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type GetFavoriteTinyDTO = {
  commercials: {
    businesses: FavoriteTiny[];
    restaurants: FavoriteTiny[];
  };
  shares: FavoriteTiny[];
  // pumpuangs is not in commercials for some reason...
  pumpuangs: FavoriteTiny[];
};
