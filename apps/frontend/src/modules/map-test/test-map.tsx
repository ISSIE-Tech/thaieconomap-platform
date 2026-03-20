'use client';

/*
This is a test page for a better clustering algorithm that can handle 6 million pins
*/

import type { Map, LatLngBounds } from 'leaflet';
import type { ClusterFeature } from 'supercluster';

import * as L from 'leaflet'; // Assuming you have a `map` instance of type `Map`

import { useEffect } from 'react';
import Supercluster from 'supercluster';
import { Marker, useMap } from 'react-leaflet';

import Stack from '@mui/material/Stack';

import { MapContainer } from 'src/shared/components/leaflet-map';
import { userMarker } from 'src/shared/components/leaflet-map/map';

import { DEFAULT_COORDINATE } from '../commercials/_config';
import { useGeolocationStore } from '../geolocation/_store/geolocation.store';
import useGetTinyRestaurants from '../commercials/_hooks/use-get-tiny-restaurants';

// Initialize Supercluster
const cluster = new Supercluster({
  radius: 40, // Cluster radius in pixels
  maxZoom: 16, // Maximum zoom level for clustering
  minZoom: 0, // Minimum zoom level for clustering
});

export default function TestMap() {
  // user geolocation
  const geolocation = useGeolocationStore((state) => state.geolocation);

  return (
    <Stack width="100vw" height="100vh" position="relative">
      {/* ref={setMap} doesn't work so I have to use <MapSetter /> */}
      <MapContainer center={geolocation ?? DEFAULT_COORDINATE} zoom={12}>
        {/* user location */}
        {geolocation && <Marker position={geolocation} icon={userMarker} />}

        <ClusterLocations />
      </MapContainer>
    </Stack>
  );
}

// --------------------------------------------------

// Define the types
type ClusterProperties = {
  cluster: true;
  point_count: number;
  [key: string]: any;
};

type FeatureProperties = {
  [key: string]: any;
};

type Cluster = ClusterFeature<ClusterProperties>;
type Feature = GeoJSON.Feature<GeoJSON.Point, FeatureProperties>;
type ClusterOrFeature = Cluster | Feature;

function ClusterLocations() {
  const { data } = useGetTinyRestaurants({});

  const getClusters = (bounds: LatLngBounds, zoom: number) =>
    cluster.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      zoom
    );

  // Define the function
  const updateMapWithClusters = (clusters: ClusterOrFeature[], map: Map): void => {
    clusters.forEach((tempCluster) => {
      const { coordinates } = tempCluster.geometry;

      if ('cluster' in tempCluster.properties) {
        // Render cluster
        const clusterIcon = L.divIcon({
          html: `<div>${tempCluster.properties.point_count}</div>`,
        });
        L.marker([coordinates[1], coordinates[0]], { icon: clusterIcon }).addTo(map);
      } else {
        // Render individual point
        L.marker([coordinates[1], coordinates[0]]).addTo(map);
      }
    });
  };

  // load data to cluster
  useEffect(() => {
    if (!data) return;

    // Load data points
    cluster.load(
      data.map((point) => ({
        type: 'Feature',
        properties: { id: point._id },
        geometry: { type: 'Point', coordinates: point.location.coordinates },
      }))
    );
  }, [data]);

  const map = useMap();

  // put cluster on map
  useEffect(() => {
    if (!map) return;

    map.on('moveend', () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      const clusters = getClusters(bounds, zoom);

      updateMapWithClusters(clusters, map);
    });
  }, [map]);

  return null;
}
