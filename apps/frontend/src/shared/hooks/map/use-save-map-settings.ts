import type { Map } from 'leaflet';
import type { MapPath } from 'src/shared/stores/map';

import { useState, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import { usePathname } from 'next/navigation';

import { useMapStore, pathLastViewedCoordMap } from 'src/shared/stores/map';

const useSaveMapSetting = () => {
  const pathname = usePathname();
  const { setLastSettings } = useMapStore((state) => state.actions);

  // constantly saving new center every time user move the map
  // NOTE: would be ideal to just save only when leave, but the map is unmounted so it can't get center in the cleanup function
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);

  // when user move or zoom, save new settings
  useMapEvents({
    moveend: (event) => {
      const map: Map = event.target;
      const { lat, lng } = map.getCenter();
      setCenter([lat, lng]);
    },
    zoomend: (event) => {
      const map: Map = event.target;
      setZoom(map.getZoom());
    },
  });

  // when leave page: save the center of last viewed map position
  // for when users leave the page and want to see the last position they viewed when they come back
  useEffect(
    () => () => {
      if (!(pathname in pathLastViewedCoordMap) || !center || !zoom) return;

      setLastSettings(pathname as MapPath, center, zoom);
    },
    [center, pathname, setLastSettings, zoom]
  );
};

export default useSaveMapSetting;
