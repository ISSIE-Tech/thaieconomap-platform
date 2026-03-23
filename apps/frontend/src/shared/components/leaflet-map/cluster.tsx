'use client';

import type L from 'leaflet';
import type { MarkerCluster, LeafletMouseEvent } from 'leaflet';

import MarkerClusterGroup from 'react-leaflet-cluster';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { useState, useEffect, useCallback, type PropsWithChildren } from 'react';

import { ClusterDialog } from './cluster-dialog';
import { groupCluster, activeCluster, areChildrenMarkersClose } from './map';

type Props = {
  iconCreateFunction: (cluster: MarkerCluster) => L.Icon | L.DivIcon;
  onClick?: (cluster: MarkerCluster) => void;
};

export const ClusterGroup = ({
  children,
  iconCreateFunction,
  onClick,
}: PropsWithChildren<Props>) => {
  const handleClusterClicked = (event: LeafletMouseEvent) => {
    const cluster = event.propagatedFrom as MarkerCluster;

    if (onClick) onClick(cluster);
  };

  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={iconCreateFunction}
      showCoverageOnHover={false}
      zoomToBoundsOnClick={false}
      onClick={handleClusterClicked}
    >
      {children}
    </MarkerClusterGroup>
  );
};

// --------------------------------------------------

type DialogProps = {
  storageKey: string;
  type: string;
  onClusterClick?: (cluster: MarkerCluster) => void;
  onClusterClickCondition?: (cluster: MarkerCluster) => boolean;
};

export enum DIALOG_STATUS {
  INIT = 'INIT',
  HAS_BEEN_OPENED = 'HAS_BEEN_OPENED',
}

export const DialogCluster = ({
  children,
  storageKey,
  type,
  onClusterClick,
  onClusterClickCondition,
}: PropsWithChildren<DialogProps>) => {
  // cluster dialog
  const [selectedCluster, setSelectedCluster] = useState<MarkerCluster | null>(null);
  const dialogController = useBoolean();
  const dialogOpened = useBoolean();

  // make the dialog appear on the first time a cluster is clicked
  // reset when component mount again
  useEffect(() => {
    // TODO: maybe setItem only if the sessionStorage is there? it's not bugging though
    sessionStorage.setItem(storageKey, DIALOG_STATUS.INIT);
  }, [storageKey]);

  const openDialogForFirstTime = useCallback(
    (cluster: MarkerCluster) => {
      // NOTE: dialog can only be opened ONCE
      // has to use sessionStorage because state here is a snapshot and can't be changed
      if (sessionStorage.getItem(storageKey) === DIALOG_STATUS.HAS_BEEN_OPENED) {
        cluster.zoomToBounds();
        return;
      }

      setSelectedCluster(cluster);
      // change the icon to active and zoom there
      cluster.setIcon(activeCluster(cluster));
      dialogController.onTrue();
    },
    [dialogController, storageKey]
  );

  const closeDialog = useCallback(() => {
    dialogOpened.onTrue();
    sessionStorage.setItem(storageKey, DIALOG_STATUS.HAS_BEEN_OPENED);
  }, [dialogOpened, storageKey]);

  const handleClusterClicked = useCallback(
    (event: LeafletMouseEvent) => {
      const cluster = event.propagatedFrom as MarkerCluster;

      if (onClusterClickCondition && onClusterClick && onClusterClickCondition(cluster)) {
        onClusterClick(cluster);
        return;
      }

      openDialogForFirstTime(cluster);
    },
    [onClusterClick, onClusterClickCondition, openDialogForFirstTime]
  );

  return (
    <>
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={groupCluster}
        showCoverageOnHover={false}
        zoomToBoundsOnClick={false}
        onClick={handleClusterClicked}
      >
        {children}
      </MarkerClusterGroup>

      {selectedCluster && (
        <ClusterDialog
          type={type}
          cluster={selectedCluster}
          controller={dialogController}
          onClose={closeDialog}
        />
      )}
    </>
  );
};

// --------------------------------------------------

type OverlappingProps = {
  storageKey: string;
  type: string;
  onOverlappingClick?: (cluster: MarkerCluster) => void;
};

export const OverlappingCluster = ({
  children,
  storageKey,
  type,
  onOverlappingClick,
}: PropsWithChildren<OverlappingProps>) => {
  const handleClick = (cluster: MarkerCluster) => {
    cluster.unspiderfy();
    cluster.zoomToBounds();

    if (onOverlappingClick) setTimeout(() => onOverlappingClick(cluster), 300);
  };

  return (
    <DialogCluster
      storageKey={storageKey}
      type={type}
      onClusterClick={handleClick}
      onClusterClickCondition={areChildrenMarkersClose}
    >
      {children}
    </DialogCluster>
  );
};
