/* @flow */
import markers from '../../data.json';

const initialState = {
    currentSelected: null,
};

export const select = (marker: Object) => ({
  type: 'SELECT',
  marker,
})

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

const findNearestIndex = (lat: number, long: number): number => {
  const distances = markers.map(({ coords }) => getDistanceFromLatLonInKm(lat, long, coords.latitude, coords.longitude));
  const min = Math.min(...distances);
  return distances.indexOf(min);
};

export default function epiceries(state: State = initialState, action: Action) {
    switch (action.type) {
        case 'SET_INITIAL_LOCATION':
          return {...state, 'currentSelected': findNearestIndex(action.location.latitude, action.location.longitude)  };
        case 'SELECT':
          return {...state, 'currentSelected': action.marker };
        default:
            return state;
    }
}
