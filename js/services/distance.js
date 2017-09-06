import type { Markers } from '../types';

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export const orderByDistance = (
  markers: Markers,
  lat: number,
  long: number,
): Markers => {
  if (markers.length === 0) {
    return [];
  }
  return Object.values(markers).sort((a, b) => {
    const distanceA = getDistanceFromLatLonInKm(lat, long, a.coords.latitude, a.coords.longitude);
    const distanceB = getDistanceFromLatLonInKm(lat, long, b.coords.latitude, b.coords.longitude);
    if ( distanceA < distanceB) {
      return -1;
    }
    if (distanceA > distanceB) {
      return 1;
    }
    return 0;
  });
}
