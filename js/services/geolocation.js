// @flow
import Config from 'react-native-config';

export const getGoogleAutocompleteUrl = (term: string, position: Object) => {
  let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${Config.GOOGLE_MAPS_API_KEY}&input=${term}`;
  url += '&types=address&components=country:uk|country:fr';

  if (position.hasOwnProperty('latitude') && position.hasOwnProperty('longitude')) {
    url += `&location=${position.latitude},${position.longitude}&radius=200`;
  }

  return url;
}

export const getDistanceBetweenPlaces = (position1: Object, position2: Object) => {
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
