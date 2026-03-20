import { useFormContext } from 'react-hook-form';

import Chip from '@mui/material/Chip';

import { RHFAutocomplete } from 'src/components/hook-form';

import { CommercialType } from '../types';
import { useGetBusinessTypes } from '../../_hooks/use-get-business-types';
import { useGetRestaurantTypes } from '../../_hooks/use-get-restaurant-types';

// ----------------------------------------------------------------------

type Props = {
  commercialType: CommercialType;
};

export default function RestaurantTypesAutocomplete({ commercialType }: Props) {
  const { setValue, watch } = useFormContext();

  const { data: restaurantTypes } = useGetRestaurantTypes();
  const { data: businessTypes } = useGetBusinessTypes();

  const types = (() => {
    switch (commercialType) {
      case CommercialType.RESTAURANT:
        return restaurantTypes;
      case CommercialType.BUSINESS:
        return businessTypes;
      case CommercialType.PUMPUANG:
        return null;
      default:
        return null;
    }
  })();

  const selectedTypeId = watch('types');

  return (
    <>
      {types && (
        <RHFAutocomplete
          name="types"
          label={`ประเภท${commercialType}`}
          multiple
          freeSolo
          options={types}
          getOptionLabel={(option) => option?.name || null}
          renderOption={(props, option) => (
            <li {...props} key={option._id}>
              {option.name}
            </li>
          )}
          value={selectedTypeId?.map((id: string) => types.find((type) => type._id === id)) || []}
          onChange={(event, newValue) => {
            setValue(
              'types',
              newValue.map((val: { name: string; _id: string }) => val?._id),
              { shouldValidate: true }
            );
          }}
          renderTags={(selected, getTagProps) =>
            selected
              .filter((option) => option?._id)
              .map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option._id}
                  label={option.name}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
          }
        />
      )}
    </>
  );
}
