import data from '../../../data.json';
import Fetcher from '../../services/Fetcher';
import { Alert } from 'react-native';
import { openingStatus } from '../../services/markerHelper';
import { orderByDistance } from '../../services/distance';
import { getGeocationData } from '../../services/geolocation';
import type { LatLng, Marker, Markers, Dispatch } from '../../types';

type State = {
  currentSelected: ?Marker,
  markers: Markers,
  isReporting: boolean,
};
export type EpicerieAction =
  | { type: 'LOAD_MARKERS', markers: Markers }
  | { type: 'SELECT', marker: Marker }
  | { type: 'REPORTING' }
  | { type: 'STOP_REPORTING' }
  | { type: 'SET_INITIAL_LOCATION' };

const initialState: State = {
  currentSelected: null,
  markers: {},
  isReporting: false,
};

export const reportNotExisting = (dispatch: Dispatch, epicerie: Marker) => {
  const body = {
    title: 'Un utilisateur vient de signaler une fermeture définitive.',
    body: `Epicerie: ${JSON.stringify(epicerie)}`,
  };
  dispatch({ type: 'REPORTING' });
  Fetcher.post('/issues', body)
    .then(() => {
      Alert.alert(
        'Merci pour votre aide!',
        'Nous traitons votre message et on ajoute les données à la prochaine mise à jour!',
      );
      dispatch({ type: 'STOP_REPORTING' });
    })
    .catch(() => {
      dispatch({ type: 'STOP_REPORTING' });
      Alert.alert('Un problème est survenu', 'Essayez à nouveau.');
    });
};

const INITIAL_LATITUDE = 48.853;
const INITIAL_LONGITUDE = 2.35;

export const loadUpToDateMarkers = (dispatch: Dispatch) => {
  Fetcher.get(
    'https://raw.githubusercontent.com/spyl94/epicerie-radar/master/data.json',
    {referrer: "Trololo"}
  )
    .then((markers: Markers) => {
      dispatch({ type: 'LOAD_MARKERS', markers });
    })
    .catch(() => {
      dispatch({ type: 'LOAD_MARKERS', markers: data });
    });
};

export const updateMarkerWithLocationData = async (currentLocation: LatLng, marker: Marker, dispatch: Dispatch) => {
  const locationData = await getGeocationData(currentLocation, marker.coords);
  dispatch({ type: 'UPDATE_MARKER', locationData, marker });
};

export const select = (marker: Marker) => ({
  type: 'SELECT',
  marker,
});

let currentLatitude = INITIAL_LATITUDE;
let currentLongitude = INITIAL_LONGITUDE;

const updateMarkerAndSelected = (state, markersAsArray) => {
  const markersOrdered = orderByDistance(markersAsArray, currentLatitude, currentLongitude);
  const markers = {};
  let i = 0;
  for (const epicerie of markersOrdered) {
    markers[i] = {
      ...epicerie,
      ...openingStatus(epicerie),
      id: i,
    };
    i++;
  }
  const currentSelected = 0;
  return { ...state, markers, currentSelected };
}

export default function epiceries(
  state: State = initialState,
  action: EpicerieAction,
): State {
  switch (action.type) {
    case 'LOAD_MARKERS': {
      return updateMarkerAndSelected(state, action.markers);
    }
    case 'SET_INITIAL_LOCATION': {
      if (currentLatitude === INITIAL_LATITUDE) {
        currentLatitude = action.location.latitude
        currentLongitude = action.location.longitude;
        const markersAsArray = orderByDistance(Object.values(state.markers), currentLatitude, currentLongitude);
        return updateMarkerAndSelected(state, markersAsArray);
      }
      return state;
    }
    case 'UPDATE_LOCATION': {
      if (currentLatitude === INITIAL_LATITUDE) {
        currentLatitude = action.location.latitude
        currentLongitude = action.location.longitude;
        const markersAsArray = orderByDistance(Object.values(state.markers), currentLatitude, currentLongitude);
        return updateMarkerAndSelected(state, markersAsArray);
      }
      return state;
    }
    case 'UPDATE_MARKER': {
      const markers = state.markers;
      markers[action.marker.id] = {...action.marker, ...action.locationData };
      return { ...state, markers };
    }
    case 'SELECT':
      return { ...state, currentSelected: action.marker };
    case 'REPORTING':
      return { ...state, isReporting: true };
    case 'STOP_REPORTING':
      return { ...state, isReporting: false };
    default:
      return state;
  }
}
