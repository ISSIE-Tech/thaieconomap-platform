'use client';

import type { PropsWithChildren } from 'react';

import { useEffect, useCallback } from 'react';

import { useBoolean } from 'src/shared/hooks/use-boolean';

import { useGeolocationStore } from './_store/geolocation.store';

// import GeolocationLoading from '../fallback/geolocation-loading'

const GeolocationProvider = ({ children }: PropsWithChildren) => {
  const isLoaded = useBoolean();
  const setGeolocation = useGeolocationStore((state) => state.setGeolocation);
  const successCallback = useCallback(
    (position: GeolocationPosition) => {
      const {
        coords: { latitude, longitude },
      } = position;

      setGeolocation([latitude, longitude]);
      isLoaded.onTrue();
    },
    [isLoaded, setGeolocation]
  );

  const errorCallback = useCallback(
    (geolocationError: GeolocationPositionError) => {
      console.log('Geolocation error', geolocationError);
      isLoaded.onTrue();
    },
    [isLoaded]
  );

  const loadGeolocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      console.log('Geolocation not supported');
      isLoaded.onTrue();
    }
  }, [successCallback, errorCallback, isLoaded]);

  useEffect(() => {
    loadGeolocation();
  }, [loadGeolocation]);

  // TODO: Refactor this to loading component
  if (!isLoaded) return <p>getting your geolocation, please wait</p>;
  //   if (!isLoaded) return <GeolocationLoading />

  return <>{children}</>;
};

export default GeolocationProvider;
