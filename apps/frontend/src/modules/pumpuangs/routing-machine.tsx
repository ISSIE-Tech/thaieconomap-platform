'use client';

import type { Marker } from 'leaflet';

import L from 'leaflet';
import 'leaflet-rotatedmarker';
import 'leaflet-routing-machine';
import { useMap } from 'react-leaflet';
import { useState, useEffect, useCallback } from 'react';

import { CONFIG } from 'src/config-global';
import { pumpuangLeftMarker } from 'src/shared/components/leaflet-map/map';

type Props = {
  coordinates: [number, number][];
  newCoordinate?: [number, number];
  angle?: number;
};

export default function RoutingMachine({ coordinates, newCoordinate, angle }: Props) {
  // how to make leaflet map zoom to a [number, number]?
  const map = useMap();

  // route history
  // if null, make route from an entire array of history
  const [route, setRoute] = useState<[number, number][] | null>(null);

  // if not null, add newCoordinate to list
  const [markerEndCoord, setMarkerEndCoord] = useState<[number, number] | null>(null);
  
  // marker icon, need to rotate based on angle
  // ideally marker SHOULD be at where the car is, but that would remove animation
  const [marker, setMarker] = useState<Marker | null>(null);

  // route maker
  const makeRouteOnMap = useCallback(
    (waypoints: [number, number][]) => {
      if (!map) return;

      const newWaypoints = waypoints.map((coord) => L.latLng(coord[0], coord[1]));

      // if you want to use event listener for animation or something
      // const routingInstance = L.Routing.control({

      // creating route on map
      // how to use my own routing machine server instead of the unreliable osrm?
      L.Routing.control({
        // history of [number, number] or [lastCoord as [number, number], newCoord as [number, number]]
        waypoints: newWaypoints,
        lineOptions: {
          styles: [
            {
              color: '#367bf6',
              opacity: 1,
              weight: 5,
            },
          ],
          extendToWaypoints: true,
          missingRouteTolerance: 0,
        },
        addWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
        /*
        https://www.liedman.net/leaflet-routing-machine/api/#l-routing-plan
        createMarker is a Routing.Plan option, but it works within L.Routing.control due to internal handling.
        */
        // How to ignore error TS2353? Will this even pass pnpm build and CICD?
        // NOTE: well this works! should probably find a better way though
        // @ts-ignore because createMarker is NOT a Routing.Control option
        createMarker: () => null, // Prevents both start and end markers

        router: new L.Routing.OSRMv1({
          serviceUrl: CONFIG.site.routingUrl,
        }),
      }).addTo(map);
    },
    [map]
  );

  const updateMarkerCoordAngle = useCallback(
    (coord: [number, number]) => {
      if (!marker || !angle) return;

      marker.setRotationAngle(angle);
      marker.setLatLng([coord[0], coord[1]]);
    },
    [angle, marker]
  );

  // ==================== INIT: run once on the first fetch ====================

  // set the center of map to pumpuang current location
  useEffect(() => {
    if (!map || !markerEndCoord) return;

    map.setView(markerEndCoord);
  }, [map, markerEndCoord]);

  // make a route from fetched coordinates ([number, number][])
  // for user to see where Pumpuang has ran passed "today" (don't know the time frame yet)
  // fetching for the first time = route is null
  useEffect(() => {
    // if route exist or coordinates is null or empty, deactivate useEffect
    if (!map || route || !coordinates || coordinates.length === 0) return;

    // route might not be needed since I can just make route on map from coordinates directly
    setRoute(coordinates);
    setMarkerEndCoord(coordinates.slice(-1)[0]);

    makeRouteOnMap(coordinates);
    updateMarkerCoordAngle(coordinates.slice(-1)[0]);
  }, [coordinates, makeRouteOnMap, map, route, updateMarkerCoordAngle]);

  // turn pumpuang image into L.marker and set it as marker
  const setCarIcon = useCallback(() => {
    if (!map || !markerEndCoord) return;

    if (!marker) {
      const pumpuangCar = L.marker(L.latLng(markerEndCoord[0], markerEndCoord[1]), {
        icon: pumpuangLeftMarker,
      }).addTo(map);

      pumpuangCar.setRotationOrigin('center');
      setMarker(pumpuangCar);
    }
  }, [map, marker, markerEndCoord]);

  // set marker to be L.marker that can rotate
  useEffect(() => {
    setCarIcon();
  }, [setCarIcon]);

  // ==================== AFTER INIT: run every fetch except the first ====================

  // every time react query get a new coordinate,
  // make a route from last end coord to there and set the marker there
  // also set new coord as last
  useEffect(() => {
    if (!newCoordinate || !markerEndCoord || !coordinates?.length) return;

    // Find the last occurrence of markerEndCoord by iterating backwards
    // iterate backward for performance (many old coords, few new coords)
    let lastIndex = -1;
    for (let i = coordinates.length - 1; i >= 0; i -= 1) {
      if (coordinates[i][0] === markerEndCoord[0] && coordinates[i][1] === markerEndCoord[1]) {
        lastIndex = i;
        break;
      }
    }

    // If the last coordinate was found, slice from there to the new coordinates
    if (lastIndex !== -1) {
      const newCoordinates = coordinates.slice(lastIndex);
      makeRouteOnMap(newCoordinates);
    }

    updateMarkerCoordAngle(newCoordinate);

    setMarkerEndCoord(newCoordinate);
  }, [coordinates, makeRouteOnMap, markerEndCoord, newCoordinate, updateMarkerCoordAngle]);

  return null;
}
