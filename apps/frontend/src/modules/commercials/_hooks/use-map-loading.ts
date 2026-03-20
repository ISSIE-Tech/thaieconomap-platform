'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const useMapLoading = (isLoading: boolean) => {
  // map
  const map = useMap();

  // make the map pulse when data for markers hasn't finished loading
  useEffect(() => {
    // if the map child component that use this hook finish rendering before the map for some reason
    // don't do anything because the mapContainer won't be there yet
    // this has never happen though but just to be safe
    if (!map) return;

    const mapContainer = document.getElementsByClassName('leaflet-container')[0];

    if (isLoading) {
      mapContainer.classList.add('animate-pulse');
    } else {
      mapContainer.classList.remove('animate-pulse');
    }
  }, [isLoading, map]);
};

export default useMapLoading;
