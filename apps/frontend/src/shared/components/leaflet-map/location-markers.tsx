'use client';

import type { MarkerIcon, PinLocation } from './types';
import type { LeafletEventHandlerFnMap } from 'leaflet';

import { useState } from 'react';
import { Marker, useMap, Tooltip } from 'react-leaflet';
import useMapLoading from 'src/modules/commercials/_hooks/use-map-loading';

type Props = {
  isLoading: boolean;
  locations?: PinLocation[];
  onMarkerClick: (locationId: string) => void;
  markerIcon: MarkerIcon;
  activeMarkerIcon: MarkerIcon;
  // highlights a marker from outside (desktop list hover/selection)
  activeId?: string;
};

export const LocationMarkers = ({
  isLoading,
  locations,
  onMarkerClick,
  markerIcon,
  activeMarkerIcon,
  activeId,
}: Props) => {
  const [locationId, setLocationId] = useState('');
  const map = useMap();
  // !! IMPORTANT: doing something complicated like opening a drawer when marker is clicked cause flickering
  // setTimeout does help prevent flickering
  const handleMarkerClickedOption = (fetchedLocation: PinLocation) =>
    // Hold ctrl and press click instead of LeafletEventHandlerFnMap if you want to know it's type
    // it has 2 definitions
    ({
      click: () => {
        setLocationId(fetchedLocation._id);
        map?.flyTo(fetchedLocation.location.coordinates);

        setTimeout(() => {
          onMarkerClick(fetchedLocation._id);
        }, 300);
      },
    }) as LeafletEventHandlerFnMap;

  const currentId = activeId || locationId;
  const getIcon = (fetchedLocation: PinLocation) =>
    currentId === fetchedLocation._id ? activeMarkerIcon : markerIcon;

  useMapLoading(isLoading);

  if (isLoading) return null;

  return (
    <>
      {locations?.map((fetchedLocation) => (
        <Marker
          key={fetchedLocation._id}
          // !! IMPORTANT: location need to be a LatLngTuple already to avoid marker flickering
          position={fetchedLocation.location.coordinates}
          title={fetchedLocation.name}
          icon={getIcon(fetchedLocation)}
          eventHandlers={handleMarkerClickedOption(fetchedLocation)}
        >
          {fetchedLocation.name && (
            <LocationTooltip
              active={fetchedLocation._id === currentId}
              name={fetchedLocation.name}
            />
          )}
        </Marker>
      ))}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------------------------

type BusinessTooltipProps = {
  active: boolean;
  name: string;
};

const LocationTooltip = ({ active, name }: BusinessTooltipProps) => (
  <>
    {/* NOTE: something like `active ? 'tooltip-active' : 'tooltip-inactive' is not possible */}
    {/* It's seem like the className of the Tooltip is permanent and can't be changed, not sure why though */}
    {active && (
      <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent className="tooltip-active">
        {name}
      </Tooltip>
    )}

    {!active && (
      <Tooltip
        direction="right"
        offset={[0, 0]}
        opacity={1}
        permanent
        className="tooltip-inactive"
      >
        {name}
      </Tooltip>
    )}
  </>
);
