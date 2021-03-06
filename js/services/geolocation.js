// @flow
import Config from 'react-native-config';
import Polyline from '@mapbox/polyline';
import type { LatLng } from '../types';

export const getGoogleAutocompleteUrl = (term: string, position: ?LatLng) => {
  let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${Config.GOOGLE_MAPS_API_KEY}&input=${term}`;
  url += '&types=address&components=country:fr';
  if (
    position.hasOwnProperty('latitude') &&
    position.hasOwnProperty('longitude')
  ) {
    url += `&location=${position.latitude},${position.longitude}&radius=200`;
  }
  return url;
};

export const getGeocationData = async (
  startLoc: LatLng,
  destinationLoc: LatLng,
): Array<LatLng> => {
  try {
    let resp = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${destinationLoc.latitude},${destinationLoc.longitude}&mode=walking&units=metric&key=${Config.GOOGLE_MAPS_API_KEY}`,
    );
    let respJson = await resp.json();
    console.log(respJson);
    const distance = respJson.routes[0].legs[0].distance;
    const duration = respJson.routes[0].legs[0].duration;
    let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
    let lineCoordinates = points.map(point => ({
        latitude: point[0],
        longitude: point[1],
    }));
    return {
      lineCoordinates,
      distance,
      duration,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};
