// import Config from "react-native-config";
import { navigateToMapScreen } from './nav';
import type { Dispatch, Location } from '../../types';

type Region = {
  latitude: number,
  longitude: number,
  latitudeDelta?: number,
  longitudeDelta?: number,
};
export type State = {
  location: Location,
  enabled: ?boolean,
  region: Region,
};

export type LocationAction =
  | { type: 'SET_LOCATION_ERROR' }
  | { type: 'UPDATE_LOCATION', location: Location }
  | { type: 'UPDATE_REGION', region: Region }
  | { type: 'SET_INITIAL_LOCATION', location: Location };

const initialState: State = {
  locationToUpdate: null,
  location: {
    latitude: 48.853,
    longitude: 2.35,
  },
  geolocated: false,
  enabled: undefined,
};

const setInitialLocation = (location: Location) => ({
  type: 'SET_INITIAL_LOCATION',
  location,
});

const updateLocation = (location: Location) => ({
  type: 'UPDATE_LOCATION',
  location,
});

export const locationError = (dispatch: Dispatch) => {
    dispatch(setLocationError());
};

const setLocationError = (message: ?string) => ({
  type: 'SET_LOCATION_ERROR',
  message,
});

export const getAndSetCurrentLocation = (dispatch: Dispatch) => {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      dispatch(setInitialLocation(coords));
      dispatch(navigateToMapScreen());
    },
    e => {
      console.log("geoloc error", e);
    },
    {
      enableHighAccuracy: false,
      // timeout: 5000,
    },
  );
  watchPosition(dispatch);
};

export const watchPosition = (dispatch: Dispatch) => {
  navigator.geolocation.watchPosition(
    ({ coords }) => dispatch(updateLocation(coords)),
    e => {
      console.log("geoloc error", e);
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
      distanceFilter: 1,
    },
  );
};

export default function location(
  state: State = initialState,
  action: LocationAction,
): State {
  switch (action.type) {
    case 'SET_INITIAL_LOCATION': {
      const location = { latitude: action.location.latitude, longitude: action.location.longitude };
      return { ...state, location, enabled: true, locationToUpdate: location, geolocated: true };
    }
    case 'UPDATE_LOCATION':
      return { ...state, location: action.location, enabled: true, geolocated: true };
    case 'SET_LOCATION_ERROR':
      return { ...state, enabled: false };
    default:
      return state;
  }
}
