'use client';

import { useEffect } from 'react';

import { useBoolean } from 'src/shared/hooks/use-boolean';
import FormButton from 'src/shared/components/custom-buttons/form-button';
import useGetHistory from 'src/modules/form-history/_hooks/use-get-history';
import EditSocialSharingDrawer from 'src/modules/create-social-sharing/edit-social-sharing-drawer/edit-social-sharing-drawer';

import type { Sharing } from '../_types/sharing.type';

type Props = {
  sharing?: Sharing | null;
};

export default function EditSharing({ sharing }: Props) {
  // EditForm
  const { refetch } = useGetHistory();
  const openEditFormDrawer = useBoolean();

  // update entire history when the drawer is opened or close?
  // TODO: this doesn't look optimal
  useEffect(() => {
    if (!openEditFormDrawer.value) {
      refetch();
    }
  }, [openEditFormDrawer.value, refetch]);

  return (
    <>
      <FormButton
        label="แก้ไข"
        onClick={openEditFormDrawer.onTrue}
        sx={{ marginRight: '20px', marginLeft: '20px', width: 'auto', paddingY: 1 }}
      />
      <EditSocialSharingDrawer openDrawer={openEditFormDrawer} sharing={sharing} />
    </>
  );
}
