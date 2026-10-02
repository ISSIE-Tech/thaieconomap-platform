import type { jobMarker } from './map';

export type MarkerIcon = typeof jobMarker;

export type PinLocation = {
  _id: string;
  name?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
};
