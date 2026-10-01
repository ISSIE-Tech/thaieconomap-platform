'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { type Map as LeafletMap } from 'leaflet';
import { useSaveMapSettings } from 'src/shared/hooks/map';

type Props = {
  setMap: (map: LeafletMap | null) => void;
};

export function MapSetter({ setMap }: Props) {
  const map = useMap();

  // clear on unmount: leaflet destroys the map, and a stale instance in the store crashes
  // whoever uses it next (e.g. the desktop sidebar calling getBounds on the next page)
  useEffect(() => {
    if (map) setMap(map);
    return () => setMap(null);
  }, [map, setMap]);

  useSaveMapSettings();

  return <>{null}</>;
}

// --------------------------------------------------

// export function ClusterTooltipsMaker(): null {
//   const map = useMap();

//   useEffect(() => {
//     const onClusterMouseOver = (event: L.LeafletEvent) => {
//       const cluster = event.layer as MarkerCluster; // Cast layer to MarkerCluster
//       const childCount = cluster.getChildCount();
//       const tooltipContent = `Cluster with ${childCount} markers`;

//       cluster
//         .bindTooltip(tooltipContent, {
//           permanent: true, // Show tooltip permanently
//           direction: 'top',
//           offset: [0, -10], // Adjust to prevent overlap
//         })
//         .openTooltip();
//     };

//     // Find all clusters and attach the event listener
//     map.eachLayer((layer) => {
//       if (layer instanceof MarkerClusterGroup) {
//         layer.on('clustermouseover', onClusterMouseOver);
//       }
//     });

//     // Cleanup function to remove event listener
//     return () => {
//       map.eachLayer((layer) => {
//         if (layer instanceof MarkerClusterGroup) {
//           layer.off('clustermouseover', onClusterMouseOver);
//         }
//       });
//     };
//   }, [map]);

//   return null;
// }
