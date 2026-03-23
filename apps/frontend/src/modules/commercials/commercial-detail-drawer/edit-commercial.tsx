'use client';

import type { Commercial } from '../_types/commercials.type';

import { useEffect } from 'react';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import FormButton from 'src/shared/components/custom-buttons/form-button';
import useGetHistory from 'src/modules/form-history/_hooks/use-get-history';
import { EditCommercialDrawer } from 'src/modules/create-commercials/edit-commercial-drawer/edit-commercial-drawer';

type Props = {
  commercial?: Commercial | null;
};

export default function EditCommercial({ commercial }: Props) {
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
      <EditCommercialDrawer openDrawer={openEditFormDrawer} commercial={commercial} />
    </>
  );
}
