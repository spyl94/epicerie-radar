// @flow
import Config from 'react-native-config';
import Polyline from '@mapbox/polyline';
import type { Location } from '../types';

export const getGoogleAutocompleteUrl = (term: string, position: ?Location) => {
  let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${Config.GOOGLE_MAPS_API_KEY}&input=${term}`;
  url += '&types=address&components=country:uk|country:fr';
  if (position.hasOwnProperty('latitude') && position.hasOwnProperty('longitude')) {
    url += `&location=${position.latitude},${position.longitude}&radius=200`;
  }
  return url;
}

export const getDistanceBetweenPlaces = (position1: Location, position2: Location) => {
  return fetch(`https://maps.google.com/maps/api/directions/json?key=${Config.GOOGLE_MAPS_API_KEY}&origin=${position1.latitude},${position1.longitude}&destination=${position2.latitude},${position2.longitude}&sensor=false&units=metric`)
    .then((response) => response.json())
    .then((json) => {
      if (json.routes.length > 0) {
        return json.routes[0].legs[0].duration.value
      } else {
        return false
      }
    })
}

export const getLineCoords = async (startLoc: Location, destinationLoc: Location) => {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc.latitude }, ${startLoc.lontitude}&destination=${ destinationLoc.latitude }, ${ destinationLoc.longitude}`)
            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map(point => {
                return  {
                    latitude : point[0],
                    longitude : point[1]
                }
            });
            return coords;
        } catch(error) {
            alert(error);
            return error;
        }
};
