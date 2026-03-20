/* eslint-disable import/no-absolute-path */
import type { MarkerCluster } from 'leaflet';

import L from 'leaflet';

import { CLUSTER_CONSTANTS } from './constant';

import job from '/public/assets/icons/job-node.svg';
import sharing from '/public/assets/icons/sharing-node.svg';
import activeJob from '/public/assets/icons/active-job-node.svg';
import commercial from '/public/assets/icons/commercial-node.svg';
import activeSharing from '/public/assets/icons/active-sharing-node.svg';
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
// eslint-disable-next-line
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
// eslint-disable-next-line
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

// eslint-disable-next-line
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
});

export const commercialMarker = new L.Icon({
  iconUrl: commercial.src,
  iconSize: new L.Point(CLUSTER_CONSTANTS.MARKER_WIDTH, CLUSTER_CONSTANTS.MARKER_HEIGHT),
});

export const pumpuangLeftMarker = new L.Icon({
  iconUrl: pumpuangLeft.src,
  iconSize: new L.Point(80, 80),
});

export const pumpuangRightMarker = new L.Icon({
  iconUrl: pumpuangRight.src,
  iconSize: new L.Point(80, 80),
});

export const activeCommercialMarker = new L.Icon({
  iconUrl: activeCommercial.src,
  iconSize: new L.Point(32, 48),
});

export const overlappingCommercialMarker = new L.Icon({
  iconUrl: overlappingCommercial.src,
  iconSize: new L.Point(32, 48),
});

export const jobMarker = new L.Icon({
  iconUrl: job.src,
  iconSize: new L.Point(CLUSTER_CONSTANTS.MARKER_WIDTH, CLUSTER_CONSTANTS.MARKER_HEIGHT),
});

export const activeJobMarker = new L.Icon({
  iconUrl: activeJob.src,
  iconSize: new L.Point(32, 48),
});

export const sharingMarker = new L.Icon({
  iconUrl: sharing.src,
  iconSize: new L.Point(CLUSTER_CONSTANTS.MARKER_WIDTH, CLUSTER_CONSTANTS.MARKER_HEIGHT),
});

export const activeSharingMarker = new L.Icon({
  iconUrl: activeSharing.src,
  iconSize: new L.Point(32, 48),
});
