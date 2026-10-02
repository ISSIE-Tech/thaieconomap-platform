 
import type { MarkerCluster } from 'leaflet';

import L from 'leaflet';

import { CLUSTER_CONSTANTS } from './constant';

import job from '/public/assets/icons/job-node.svg';
import sharing from '/public/assets/icons/sharing-node.svg';
import business from '/public/assets/icons/business-node.svg';
import activeJob from '/public/assets/icons/active-job-node.svg';
import restaurant from '/public/assets/icons/restaurant-node.svg';
import activeSharing from '/public/assets/icons/active-sharing-node.svg';
import activeBusiness from '/public/assets/icons/active-business-node.svg';
import activeRestaurant from '/public/assets/icons/active-restaurant-node.svg';
import activeCommercial from '/public/assets/icons/active-commercial-node.svg';
import pumpuangLeft from '/public/assets/icons/pumpuang/Handoff_Icon-Red-Left.png';
import pumpuangRight from '/public/assets/icons/pumpuang/Handoff_Icon-Red-Right.png';
import overlappingCommercial from '/public/assets/icons/overlapping-commercial-node.svg';

export const areChildrenMarkersClose = (cluster: MarkerCluster) => {
  const children = cluster.getAllChildMarkers();
  const center = cluster.getBounds().getCenter();

  // console.log(children[0].getLatLng().distanceTo(center))

  // find a single marker with distance higher than 25 metres
  // if it can't, return true (!undefined)
  return !children.find((marker) => marker.getLatLng().distanceTo(center) > 25);
};

// NOTE: iconCreateFunction is running by leaflet, which is not support ES6 arrow func syntax
 
export const groupCluster = function (cluster: MarkerCluster) {
  const childCount = cluster.getChildCount();

  const size =
    childCount <= CLUSTER_CONSTANTS.MAX_SMALL_CHILD_COUNT
      ? CLUSTER_CONSTANTS.CLUSTER_SMALL_SIZE
      : childCount > CLUSTER_CONSTANTS.MAX_MEDIUM_CHILD_COUNT
        ? CLUSTER_CONSTANTS.CLUSTER_MEDIUM_SIZE
        : childCount * CLUSTER_CONSTANTS.CLUSTER_LARGE_SIZE_FACTOR;

  return createClusterIcon(size, childCount);
};

// How to give the Icon tooltips?
// NOTE: iconCreateFunction is running by leaflet, which is not support ES6 arrow func syntax
 
export const createCommercialOverlappingClusterIcon = function (cluster: MarkerCluster) {
  const childCount = cluster.getChildCount();

  if (areChildrenMarkersClose(cluster)) {
    return overlappingCommercialMarker;
  }

  const size =
    childCount <= CLUSTER_CONSTANTS.MAX_SMALL_CHILD_COUNT
      ? CLUSTER_CONSTANTS.CLUSTER_SMALL_SIZE
      : childCount > CLUSTER_CONSTANTS.MAX_MEDIUM_CHILD_COUNT
        ? CLUSTER_CONSTANTS.CLUSTER_MEDIUM_SIZE
        : childCount * CLUSTER_CONSTANTS.CLUSTER_LARGE_SIZE_FACTOR;

  return createClusterIcon(size, childCount);
};

 
export const activeCluster = function (cluster: MarkerCluster) {
  const childCount = cluster.getChildCount();
  const size =
    childCount <= CLUSTER_CONSTANTS.MAX_SMALL_CHILD_COUNT
      ? CLUSTER_CONSTANTS.CLUSTER_ACTIVE_SMALL_SIZE
      : childCount > CLUSTER_CONSTANTS.MAX_MEDIUM_CHILD_COUNT
        ? CLUSTER_CONSTANTS.CLUSTER_ACTIVE_MEDIUM_SIZE
        : childCount * CLUSTER_CONSTANTS.CLUSTER_LARGE_SIZE_FACTOR +
          CLUSTER_CONSTANTS.CLUSTER_ACTIVE_ADDITION;

  return createClusterIcon(size, childCount);
};

const createClusterIcon = (size: number, childCount: number) => {
  const styleSize =
    childCount < CLUSTER_CONSTANTS.STYLE_SMALL_CHILD_COUNT
      ? 'small'
      : childCount < CLUSTER_CONSTANTS.STYLE_MEDIUM_CHILD_COUNT
        ? 'medium'
        : 'large';

  const clusterColor = `bg-cluster-${styleSize}`;
  const clusterBoundaryOpacity = `bg-cluster-bound-${styleSize}`;

  return L.divIcon({
    html: `<div class="bg-cluster ${clusterColor}">${childCount}</div>`,
    className: `bg-cluster-bound ${clusterBoundaryOpacity}`,
    iconSize: L.point(size, size, true),
  });
};

// turn html and className into pure css classes
export const userMarker = new L.DivIcon({
  html: '<div class="user-marker-inner" />',
  className: 'user-marker-icon',
  iconSize: new L.Point(CLUSTER_CONSTANTS.USER_MARKER_WIDTH, CLUSTER_CONSTANTS.USER_MARKER_HEIGHT),
  iconAnchor: new L.Point(CLUSTER_CONSTANTS.USER_MARKER_WIDTH / 2, CLUSTER_CONSTANTS.USER_MARKER_HEIGHT / 2),
});

// Pin SVGs are 30x35 with the tip at y≈32.7 and the head centred at y=15. Keep that
// aspect ratio (a 32x48 box letterboxed them) and anchor at the tip, not the centre.
const pinIcon = (iconUrl: string, active = false) => {
  const [w, h] = active ? [44, 51] : [32, 37];
  const tipY = Math.round((h * 32.7) / 35);
  return new L.Icon({
    iconUrl,
    iconSize: [w, h],
    iconAnchor: [w / 2, tipY],
    // labels sit to the right of the pin head
    tooltipAnchor: [w / 2, Math.round((h * 15) / 35) - tipY],
  });
};

export const restaurantMarker = pinIcon(restaurant.src);

export const activeRestaurantMarker = pinIcon(activeRestaurant.src, true);

export const businessMarker = pinIcon(business.src);

export const activeBusinessMarker = pinIcon(activeBusiness.src, true);

// Truck PNGs are cropped to the truck (1:2, 2x for retina). They rotate with the heading
// around their centre (rotationOrigin="center"), so they anchor at the centre, not a tip.
const truckIcon = (iconUrl: string) =>
  new L.Icon({ iconUrl, iconSize: [24, 48], iconAnchor: [12, 24] });

export const pumpuangLeftMarker = truckIcon(pumpuangLeft.src);

export const pumpuangRightMarker = truckIcon(pumpuangRight.src);

export const activeCommercialMarker = pinIcon(activeCommercial.src, true);

export const overlappingCommercialMarker = pinIcon(overlappingCommercial.src);

export const jobMarker = pinIcon(job.src);

export const activeJobMarker = pinIcon(activeJob.src, true);

export const sharingMarker = pinIcon(sharing.src);

export const activeSharingMarker = pinIcon(activeSharing.src, true);
