import { navigateToMapScreen } from './nav';
import type { Dispatch, Location } from '../../types';

type Region = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
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

const locationError = (message: string, dispatch: Dispatch) => {
  if (
    message === 'Location request timed out' ||
    message === 'No available location provider.'
  ) {
    dispatch(setLocationError(message));
  }
};

const setLocationError = (message: string) => ({
  type: 'SET_LOCATION_ERROR',
  message,
});

export const getAndSetCurrentLocation = (dispatch: Dispatch) => {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      dispatch(setInitialLocation(coords));
      dispatch(navigateToMapScreen());
    },
    ({ message }) => locationError(message, dispatch),
    {
      enableHighAccuracy: true,
      timeout: 5000,
    },
  );
  watchPosition(dispatch);
};

export const watchPosition = (dispatch: Dispatch) => {
  navigator.geolocation.watchPosition(
    ({ coords }) => dispatch(updateLocation(coords)),
    ({ message }) => locationError(message, dispatch),
    {
      enableHighAccuracy: true,
      timeout: 10000,
    },
  );
};

export default function location(
  state: State = initialState,
  action: LocationAction,
): State {
  switch (action.type) {
    case 'UPDATE_REGION':
      if (
        action.region.longitudeDelta < 100 &&
        action.region.latitudeDelta &&
        action.region.longitude != 0
      ) {
        return { ...state, region: action.region };
      }
      return state;
    case 'SET_INITIAL_LOCATION':
      const region = {
        ...state.region,
        longitude: action.location.longitude,
        latitude: action.location.latitude,
      };
      return { ...state, location: action.location, enabled: true, region };
    case 'UPDATE_LOCATION':
      return { ...state, location: action.location, enabled: true };
    case 'SET_LOCATION_ERROR':
      return { ...state, enabled: false };
    default:
      return state;
  }
}
