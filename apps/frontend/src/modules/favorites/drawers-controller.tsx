'use client';

import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import { PumpuangDrawer } from '../pumpuangs/detail-drawer';
import useGetSharing from '../sharings/_hooks/use-get-sharing';
import { SharingDrawer } from '../sharings/sharing-detail-drawer';
import useGetPumpuangById from '../pumpuangs/_hooks/use-get-pumpuang';
import useGetCommercial from '../commercials/_hooks/use-get-commercial';
import { CommercialDrawer } from '../commercials/commercial-detail-drawer';

type Props = {
  selectedId: string;
  commercialController: UseBooleanReturn;
  sharingController: UseBooleanReturn;
  pumpuangController: UseBooleanReturn;
};

export default function DrawersController({
  selectedId,
  commercialController,
  sharingController,
  pumpuangController,
}: Props) {
  // Commercial
  const { data: commercial } = useGetCommercial({
    commercialId: selectedId,
    enabled: commercialController.value,
  });
  // Sharing
  const { data: sharing } = useGetSharing({
    sharingId: selectedId,
    enabled: sharingController.value,
  });
  // Pumpuang
  const { data: pumpuang } = useGetPumpuangById(selectedId, pumpuangController.value);

  return (
    <>
      <CommercialDrawer controller={commercialController} commercial={commercial} />
      <PumpuangDrawer controller={pumpuangController} pumpuang={pumpuang} />
      <SharingDrawer controller={sharingController} sharing={sharing} />
    </>
  );
}
