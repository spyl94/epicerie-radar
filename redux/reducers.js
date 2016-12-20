/* @flow */
import { combineReducers } from 'redux';
import location from './reducers/location';
import { List } from 'immutable';
import markers from '../data.json';

const SELECT = 'epicerie/SELECT';
const SHOW_MODAL = 'epicerie/SHOW_MODAL';
const HIDE_MODAL = 'epicerie/HIDE_MODAL';

const INITIAL_LATITUDE = 48.853;
const INITIAL_LONGITUDE = 2.35;

const initialState = {
    currentSelected: null,
    modalVisible: false,
    showMap: false,
};

export const firstScreenLoader = (dispatch: Function) => {
  setTimeout(() => {
    dispatch({type: 'SHOW_MAP'})
  }, 3000);
}

export const select = (marker: Object) => ({
  type: SELECT,
  marker,
})

export const showModal = () => ({
  type: SHOW_MODAL,
})

export const hideModal = () => ({
  type: HIDE_MODAL,
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

const findNearestIndex = (lat, long) => {
  const distances = markers.map(({coords}) => getDistanceFromLatLonInKm(lat, long, coords.latitude, coords.longitude));
  const min = Math.min(...distances);
  return distances.indexOf(min);
};

function epiceries(state = initialState, action) {
    switch (action.type) {
        case 'SET_INITIAL_LOCATION':
          return {...state, 'showMap': true, 'currentSelected': findNearestIndex(action.location.latitude, action.location.longitude)  };
        case 'SHOW_MAP':
          return {...state, 'showMap': true };
        case SELECT:
          return {...state, 'currentSelected': action.marker };
        case SHOW_MODAL:
          return {...state, 'modalVisible': true };
        case HIDE_MODAL:
          return {...state, 'modalVisible': false };
        default:
            return state;
    }
}

export default combineReducers({
    default: epiceries,
    location,
});
