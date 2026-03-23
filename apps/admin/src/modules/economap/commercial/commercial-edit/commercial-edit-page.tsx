'use client';

import type { FormSchema } from '../commercial-create/form-schema';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { reformatDefaultValues } from './utils';
import CommercialEditForm from './commercial-edit-form';
import { CommercialType } from '../commercial-create/types';
import { useGetCommercials } from '../_hooks/use-get-commercials';

type Props = {
  commercialId: string;
};

export function CommercialEditPage({ commercialId }: Props) {
  const [defaultValue, setDefaultValue] = useState<FormSchema>();
  const { data: commercialResponse } = useGetCommercials();

  const commercial = useMemo(
    () => commercialResponse?.data.find((item) => item._id === commercialId),
    [commercialResponse, commercialId]
  );

  const fetchDefaultValue = useCallback(async () => {
    const values = await reformatDefaultValues(commercial);
    setDefaultValue(values);
  }, [commercial]);

  const commercialType = () => {
    switch (commercial?.category) {
      case 'BUSINESS':
        return CommercialType.BUSINESS;
      case 'RESTAURANT':
        return CommercialType.RESTAURANT;
      default:
        return CommercialType.RESTAURANT;
    }
  };

  useEffect(() => {
    if (commercial) {
      fetchDefaultValue();
    }
  }, [commercial, fetchDefaultValue]);

  return (
    <>
      {defaultValue && commercial && (
        <CommercialEditForm
          defaultValue={defaultValue}
          commercialType={commercialType()}
          commercial={commercial}
        />
      )}
    </>
  );
}
