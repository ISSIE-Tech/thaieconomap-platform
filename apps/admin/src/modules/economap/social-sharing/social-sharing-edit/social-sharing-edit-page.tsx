'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { reformatDefaultValues } from './utils';
import SocialSharingEditForm from './social-sharing-edit-form';
import { useGetSocialSharings } from '../_hooks/use-get-social-sharings';

import type { FormSchema } from '../social-sharing-create/form-schema';

type Props = {
  socialSharingId: string;
};

export function SocialSharingEditPage({ socialSharingId }: Props) {
  const [defaultValue, setDefaultValue] = useState<FormSchema>();
  const { data: socialSharingResponse } = useGetSocialSharings();

  const socialSharing = useMemo(
    () => socialSharingResponse?.find((item) => item._id === socialSharingId),
    [socialSharingResponse, socialSharingId]
  );

  const fetchDefaultValue = useCallback(async () => {
    const values = await reformatDefaultValues(socialSharing);
    setDefaultValue(values);
  }, [socialSharing]);

  useEffect(() => {
    if (socialSharing) {
      fetchDefaultValue();
    }
  }, [socialSharing, fetchDefaultValue]);

  return (
    <>
      {defaultValue && socialSharing && (
        <SocialSharingEditForm defaultValue={defaultValue} socialSharing={socialSharing} />
      )}
    </>
  );
}
