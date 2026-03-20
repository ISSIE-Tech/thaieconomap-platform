import type { ApiResponse } from 'src/shared/types/api.type';

import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';

import type { GetFavoriteTinyDTO } from '../_types/favorites.type';

export const getTinyFavorites = async () => {
  const { data } = await axios.get<ApiResponse<GetFavoriteTinyDTO>>(endpoints.users.favorites);

  return data.data;
};
