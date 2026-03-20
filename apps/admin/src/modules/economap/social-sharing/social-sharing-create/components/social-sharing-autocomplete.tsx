import React from 'react';
import { useFormContext } from 'react-hook-form';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { RHFAutocomplete } from 'src/components/hook-form/rhf-autocomplete';

import { useGetSocialSharingTypes } from '../../_hooks/use-get-social-sharing-types';
import { useGetSocialSharingConditions } from '../../_hooks/use-get-social-sharing-conditions';

export function SocialSharingAutocomplete() {
  const { setValue, watch } = useFormContext();

  const { data: types } = useGetSocialSharingTypes();
  const { data: conditions } = useGetSocialSharingConditions();

  const selectedTypeId = watch('types');

  const selectedConditionId = watch('condition');

  return (
    <Stack spacing={3}>
      {types && (
        <RHFAutocomplete
          name="types"
          label="ประเภทสิ่งของ"
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

      {conditions && (
        <RHFAutocomplete
          name="condition"
          label="สภาพสิ่งของ"
          options={conditions}
          getOptionLabel={(option) => option?.name || ''}
          renderOption={(props, option) => (
            <li {...props} key={option._id}>
              {option.name}
            </li>
          )}
          value={conditions.find((condition) => condition._id === selectedConditionId) || null}
          onChange={(event, newValue) => {
            setValue('condition', newValue?._id || '', { shouldValidate: true });
          }}
        />
      )}
    </Stack>
  );
}
