import type { Time, UserRef } from '../commercial/types';
import type { ECONOMAP_STATUS } from '../_config/economap-status.config';

export type PumpuangItem = {
  _id: string;
  name: string;
  licensePlate: string;
  owner: string;
  color: string;
  phoneNumber: string;
  moreInfo: string;
  imageUrl: string;
  additionalImageUrl: string[];
  submissionStatus: ECONOMAP_STATUS;
  status?: 'RUNNING' | 'INACTIVE';
  opening: {
    day: string;
    enable: boolean;
    hours: Time[];
  }[];
  displayOpening: {
    days: string;
    time: Time[];
  }[];
  types: {
    _id: string;
    name: string;
  }[];
  submissionMessage?: string;

  // timestamps
  createdAt?: string;
  updatedAt?: string;
  createdBy?: UserRef;
  lastModifiedAt?: string;
  lastModifiedBy?: UserRef;
  approvedBy?: UserRef;
};

export type PumpuangTableFilters = {
  status: ECONOMAP_STATUS;
  owner: string;
};

// Tracking history types (after TransformPumpuangLocation interceptor, data is GeoJSON)
export type GeoJsonPoint = {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
};

export type GeoJsonLineString = {
  type: 'LineString';
  coordinates: [number, number][]; // [[longitude, latitude], ...]
  startedAt?: string;
  endedAt?: string;
};

export type PumpuangRouteResponse = {
  _id: string;
  current: GeoJsonPoint;
  history: GeoJsonLineString[];
  types: {
    _id: string;
    name: string;
  }[];
  lastLocationSent?: number;
};
