'use client';

import type { Marker } from 'leaflet';

import L from 'leaflet';
import 'leaflet-rotatedmarker';
import { useMap, Polyline } from 'react-leaflet';
import { useState, useEffect, useCallback } from 'react';
import { pumpuangLeftMarker, pumpuangRightMarker } from 'src/shared/components/leaflet-map/map';

// import RoutingMachine from '../routing-machine';
import useGetPumpuangRouteById from '../_hooks/use-get-pumpuang-route';

type Props = {
  id: string;
};

export function PumpuangRoutingHistory({ id }: Props) {
  const { data: routeHistory } = useGetPumpuangRouteById(id);
  const [newCoordinate, setNewCoordiate] = useState<[number, number] | null>(null);
  const [angle, setAngle] = useState<number | null>(null);

  const map = useMap();

  // marker icon, need to rotate based on angle
  // ideally marker SHOULD be at where the car is, but that would remove animation
  const [marker, setMarker] = useState<Marker | null>(null);

  // update newCoordinate and angle from routeHistory
  useEffect(() => {
    if (!routeHistory) return;

    setNewCoordiate(routeHistory.current.location.coordinates);
    setAngle(routeHistory.current.direction);
  }, [routeHistory]);

  const getIconByDirection = useCallback(
    (dir: number) => (dir >= 0 && dir < 180 ? pumpuangRightMarker : pumpuangLeftMarker),
    []
  );

  // turn pumpuang image into L.marker and set it as marker
  const setCarIcon = useCallback(() => {
    if (!map || !newCoordinate || angle === null) return;

    if (!marker) {
      const pumpuangCar = L.marker(L.latLng(newCoordinate[0], newCoordinate[1]), {
        icon: getIconByDirection(angle),
        zIndexOffset: 1000,
      }).addTo(map);

      pumpuangCar.setRotationOrigin('center');
      pumpuangCar.setRotationAngle(angle);
      setMarker(pumpuangCar);
    }
  }, [map, marker, newCoordinate, angle, getIconByDirection]);

  // set marker to be L.marker that can rotate
  useEffect(() => {
    setCarIcon();
  }, [setCarIcon]);

  const updateMarkerCoordAngle = useCallback(() => {
    if (!marker || !newCoordinate || angle === null) return;

    marker.setRotationAngle(angle);
    marker.setIcon(getIconByDirection(angle));
    marker.setLatLng([newCoordinate[0], newCoordinate[1]]);
  }, [angle, marker, newCoordinate, getIconByDirection]);

  // whenever new coord and angle come in
  // set the center of map to pumpuang current location
  // set the marker there with the angle
  useEffect(() => {
    if (!map || !newCoordinate || angle === null) return;

    map.setView(newCoordinate);
    updateMarkerCoordAngle();
  }, [angle, map, newCoordinate, updateMarkerCoordAngle]);

  return routeHistory?.history.map((shortHistory, index) => (
    <Polyline
      key={index}
      pathOptions={{
        color: '#367bf6',
        opacity: 1,
        weight: 5,
      }}
      positions={shortHistory.coordinates}
    />
  ));
}
