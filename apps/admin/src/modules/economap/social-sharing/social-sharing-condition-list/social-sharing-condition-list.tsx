'use client';

import BaseTypeList from 'src/modules/economap/commercial/commercial-type-list/components/base-type-list';
import { useGetSocialSharingConditions } from 'src/modules/economap/social-sharing/_hooks/use-get-social-sharing-conditions';
import { useCreateSocialSharingCondition } from 'src/modules/economap/social-sharing/_hooks/use-create-social-sharing-condition';

import { useDeleteSocialSharingCondition } from '../_hooks/use-delete-social-sharing-condition';

export function SocialSharingConditionList() {
  const socialSharingConditions = useGetSocialSharingConditions();

  const createSocialSharingCondition = useCreateSocialSharingCondition();

  const mock = useDeleteSocialSharingCondition();

  const data = {
    label: 'ประเภทสภาพสิ่งของ',
    commercialTypes: socialSharingConditions.data,
    create: {
      mutation: createSocialSharingCondition.mutateAsync,
      isPending: createSocialSharingCondition.isPending,
    },
    delete: {
      mutation: mock.mutateAsync,
      isPending: mock.isPending,
    },
  };

  return <BaseTypeList data={data} />;
}
