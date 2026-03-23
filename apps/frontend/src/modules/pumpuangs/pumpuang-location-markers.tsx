'use client';

import type { LeafletEventHandlerFnMap } from 'leaflet';
import type { PumpuangTiny } from './_types/pumpuangs.type';

import { Marker, useMap } from 'react-leaflet';
import { useRef, useMemo, useEffect } from 'react';
import useMapLoading from 'src/modules/commercials/_hooks/use-map-loading';
import { pumpuangLeftMarker, pumpuangRightMarker } from 'src/shared/components/leaflet-map/map';

type Props = {
  isLoading: boolean;
  locations?: PumpuangTiny[];
  onMarkerClick: (locationId: string) => void;
};

export const PumpuangLocationMarkers = ({ isLoading, locations, onMarkerClick }: Props) => {
  const map = useMap();

  const markerRefs = useRef<{ [id: string]: L.Marker | null }>({});

  // get direction of location from id
  const idDirectionMap = useMemo(
    () =>
      locations?.reduce(
        (hashMap, location) => {
          hashMap[location._id] = location.current.direction;
          return hashMap;
        },
        {} as Record<string, number>
      ),
    [locations]
  );

  useEffect(() => {
    if (!locations) return;

    locations.forEach((location) => {
      const marker = markerRefs.current[location._id];
      if (marker && idDirectionMap) {
        marker.setRotationAngle(idDirectionMap?.[location._id] || 0);
        marker.setIcon(
          idDirectionMap?.[location._id] < 180 && idDirectionMap?.[location._id] >= 0
            ? pumpuangRightMarker
            : pumpuangLeftMarker
        );
      }
    });
  }, [idDirectionMap, locations]); // Add `idDirectionMap` as a dependency

  // !! IMPORTANT: doing something complicated like opening a drawer when marker is clicked cause flickering
  // setTimeout does help prevent flickering
  const handleMarkerClickedOption = (fetchedLocation: PumpuangTiny) =>
    // Hold ctrl and press click instead of LeafletEventHandlerFnMap if you want to know it's type
    // it has 2 definitions
    ({
      click: () => {
        map?.flyTo(fetchedLocation.current.location.coordinates);

        setTimeout(() => {
          onMarkerClick(fetchedLocation._id);
        }, 300);
      },
    }) as LeafletEventHandlerFnMap;

  useMapLoading(isLoading);

  if (isLoading) return null;

  return (
    <>
      {locations?.map((fetchedLocation) => (
        // TODO: change icon's angle based on direction
        <Marker
          key={fetchedLocation._id}
          ref={(element) => {
            if (element) markerRefs.current[fetchedLocation._id] = element;
          }}
          // !! IMPORTANT: location need to be a LatLngTuple already to avoid marker flickering
          position={fetchedLocation.current.location.coordinates}
          icon={
            fetchedLocation.current.direction < 180 && fetchedLocation.current.direction >= 0
              ? pumpuangRightMarker
              : pumpuangLeftMarker
          }
          rotationOrigin="center"
          rotationAngle={fetchedLocation.current.direction}
          eventHandlers={handleMarkerClickedOption(fetchedLocation)}
        />
      ))}
    </>
  );
};
