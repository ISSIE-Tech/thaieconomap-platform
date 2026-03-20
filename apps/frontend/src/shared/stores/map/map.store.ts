import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { paths } from 'src/shared/routes/paths.config';

const MAP_SETTINGS = {
  CENTER: 'ViewedCoord',
  ZOOM: 'Zoom',
};

export const pathLastViewedCoordMap = {
  [paths.commercials.restaurants]: 'commercialLast',
  [paths.commercials.businesses]: 'commercialLast',
  [paths.commercials.pumpuang]: 'commercialLast',

  // jobs and sharings aren't tabs, so it should go back to default when leave page
  // but this might not be what the boss want

  // [paths.jobs]: 'jobLastViewedCoord',
  // [paths.sharings]: 'sharingLastViewedCoord',
} as const;

export type MapPath = keyof typeof pathLastViewedCoordMap;

type MapStore = {
  // all page with map
  commercialLastViewedCoord: [number, number] | null;
  commercialLastZoom: number | null;

  actions: {
    setLastSettings: (mapType: MapPath, coord: [number, number], zoom: number) => void;
  };
};

export const useMapStore = create<MapStore>()(
  devtools((set) => ({
    commercialLastViewedCoord: null,
    commercialLastZoom: null,

    actions: {
      setLastSettings: (mapType: MapPath, coord: [number, number], zoom: number) =>
        set({
          [`${pathLastViewedCoordMap[mapType]}${MAP_SETTINGS.CENTER}`]: coord,
          [`${pathLastViewedCoordMap[mapType]}${MAP_SETTINGS.ZOOM}`]: zoom,
        }),
    },
  }))
);
