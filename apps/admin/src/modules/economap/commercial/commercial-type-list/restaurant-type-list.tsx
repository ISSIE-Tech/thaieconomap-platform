'use client';

import BaseTypeList from './components/base-type-list';
import { useGetRestaurantTypes } from '../_hooks/use-get-restaurant-types';
import { useCreateRestaurantType } from '../_hooks/use-create-restaurant-type';
import { useDeleteRestaurantType } from '../_hooks/use-delete-restaurant-type';

// ----------------------------------------------------------------------

export function RestaurantTypeList() {
  const { data: restaurantTypes } = useGetRestaurantTypes();

  const { mutateAsync: createMutation, isPending: createPending } = useCreateRestaurantType();

  const { mutateAsync: deleteMutation, isPending: deletePending } = useDeleteRestaurantType();

  const data = {
    commercialTypes: restaurantTypes,
    label: 'ประเภทร้านอาหาร',

    create: {
      mutation: createMutation,
      isPending: createPending,
    },
    delete: {
      mutation: deleteMutation,
      isPending: deletePending,
    },
  };

  return <BaseTypeList data={data} />;
}
