import type { commercialMarker } from './map';

export type MarkerIcon = typeof commercialMarker;

export type PinLocation = {
  _id: string;
  name?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
};
