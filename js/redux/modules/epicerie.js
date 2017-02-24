// @flow
import data from '../../../data.json';
import moment from 'moment';
import Fetcher from '../../services/Fetcher'
import { Alert } from 'react-native'

export const reportNotExisting = (dispatch, epicerie) => {
    const body = {
      title: 'Un utilisateur vient de signaler une fermeture définitive.',
      body: `Epicerie: ${JSON.stringify(epicerie)}`,
    };
    dispatch({type: 'REPORTING'});
    Fetcher
    .post('/issues', body)
    .then(() => {
      Alert.alert('Merci pour votre aide!', 'Nous traitons votre message et on ajoute les données à la prochaine mise à jour!');
      dispatch({type: 'STOP_REPORTING'});
    })
    .catch(() => {
      dispatch({type: 'STOP_REPORTING'});
      Alert.alert('Un problème est survenu', 'Essayez à nouveau.');
    });
}

export const openingStatus = epicerie => {
  const date = moment();
  const currentHour = date.hours();
  let checkingHoursOfPrevDay = false;
  if (currentHour < 6) {
    date.subtract(1, 'day');
    checkingHoursOfPrevDay = true;
  }
  const currentDay = date.format('dddd').slice(0, 3).toLowerCase();
  if (typeof epicerie.hours == "undefined" || !epicerie.hours[currentDay + '_close']) {
    return {
      color: "grey",
      type: "unknown",
      text: "Horaire non disponible..."
    };
  }
  const closingHour = parseInt(epicerie.hours[currentDay + '_close'].slice(0, 2), 10);
  if (
       (checkingHoursOfPrevDay && currentHour > closingHour)
    || (!checkingHoursOfPrevDay && currentHour < closingHour)
  ) {
    return {
      color: '#fa3e3e',
      type: "close",
      text: 'Actuellement fermé',
    };
  }
  return {
    color: '#42b72a',
    type: "open",
    text: "Ouvert jusqu'à " + epicerie.hours[currentDay + '_close']
  };
}

type State = {
  currentSelected: Object,
}

type Action = Object;

const initialState = {
    currentSelected: null,
    markers: [],
    isReporting: false,
};

const markerUnknown = require('../../../img/marker_unknown_full.png');
const markerOpen = require('../../../img/marker_open_full.png');
const markerClose = require('../../../img/marker_close_full.png');
const markerUnknownSelected = require('../../../img/marker_unknown.png');
const markerOpenSelected = require('../../../img/marker_open.png');
const markerCloseSelected = require('../../../img/marker_close.png');

export const loadUpToDateMarkers = (dispatch: Function) => {
  Fetcher
    .get('https://raw.githubusercontent.com/spyl94/epicerie-radar/master/data.json')
    .then(markers => {
      dispatch({ type: 'LOAD_MARKERS', markers});
    })
    .catch(error => {
      dispatch({ type: 'LOAD_MARKERS', markers: data });
    });
}

export const getMarkerImage = (type: string, isSelected: boolean) => {
  if (type === "open") {
    if (isSelected) {
      return markerOpenSelected;
    }
    return markerOpen;
  }
  if (type === "close") {
    if (isSelected) {
      return markerCloseSelected;
    }
    return markerClose;
  }
  if (isSelected) {
    return markerUnknownSelected;
  }
  return markerUnknown;
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

const INITIAL_LATITUDE = 48.853;
const INITIAL_LONGITUDE = 2.35;

export default function epiceries(state: State = initialState, action: Action) {
    switch (action.type) {
      case 'LOAD_MARKERS':
          const markers = [];
          for (const epicerie of action.markers) {
            markers.push({ ...epicerie, ...openingStatus(epicerie) });
          }
          return {...state, markers: markers };
      case 'SET_LOCATION_ERROR':
          return {...state, 'currentSelected': findNearestIndex(INITIAL_LATITUDE, INITIAL_LONGITUDE) };
        case 'SET_INITIAL_LOCATION':
          return {...state, 'currentSelected': findNearestIndex(action.location.latitude, action.location.longitude)  };
        case 'SELECT':
          return {...state, 'currentSelected': action.marker };
        case  'REPORTING':
          return {...state, isReporting: true };
        case  'STOP_REPORTING':
          return {...state, isReporting: false };
        default:
            return state;
    }
}
