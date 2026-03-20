'use client';

import React, { useState, useEffect, useCallback } from 'react';

import { reformatDefaultValues } from './utils';
import { AnnouncementsEditForm } from './announcements-edit-form';
import { useGetAnnouncementsById } from '../_hooks/use-get-announcement-by-id';

import type { FormSchema } from '../announcements-create/form-schema';

type Props = {
  announcementId: string;
};

const AnnouncementEditPage = ({ announcementId }: Props) => {
  const { data: announcementData } = useGetAnnouncementsById({ id: announcementId });
  const [defaultValue, setDefaultValue] = useState<FormSchema>();

  const fetchDefaultValue = useCallback(async () => {
    if (announcementData) {
      const values = await reformatDefaultValues(announcementData);
      setDefaultValue(values);
    }
  }, [announcementData]);

  useEffect(() => {
    fetchDefaultValue();
  }, [fetchDefaultValue]);

  return (
    <>
      {defaultValue && announcementData && (
        <AnnouncementsEditForm defaultValue={defaultValue} announcementData={announcementData} />
      )}
    </>
  );
};

export default AnnouncementEditPage;
