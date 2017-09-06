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
  location: {
    latitude: 48.853,
    longitude: 2.35,
  },
  region: {
    latitude: 48.853,
    longitude: 2.35,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  },
  ready: false,
  enabled: undefined,
};

const setInitialLocation = (location: Location) => ({
  type: 'SET_INITIAL_LOCATION',
  location,
});

export const updateRegion = (region: Region) => ({
  type: 'UPDATE_REGION',
  region,
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
      // error(e);
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
      // error(e);
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
    case 'UPDATE_REGION':
      if (action.region.longitude != 0) {
        return { ...state, region: {...state.region, ...action.region } };
      }
      return state;
    case 'SET_INITIAL_LOCATION':
      const region = {
        ...state.region,
        longitude: action.location.longitude,
        latitude: action.location.latitude,
      };
      return { ...state, location: action.location, enabled: true, region, ready: true };
    case 'UPDATE_LOCATION':
      return { ...state, location: action.location, enabled: true, ready: true };
    case 'SET_LOCATION_ERROR':
      return { ...state, enabled: false };
    default:
      return state;
  }
}
