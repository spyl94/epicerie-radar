/* @flow */

type Location = {
  latitude: Number,
  longitude: Number,
}
type Region = {
  latitude: Number,
  longitude: Number,
  latitudeDelta: Number,
  longitudeDelta: Number,
}
type State = {
  location: Location,
  enabled: ?boolean,
  region: Region,
}

type Action = Object;

const initialState: State = {
  location: {
    latitude: 0,
    longitude: 0,
  },
  region: {
    latitude: 48.853,
    longitude: 2.35,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  },
  enabled: undefined,
}

const setInitialLocation = (location: Location) => ({
  type: 'SET_INITIAL_LOCATION',
  location,
})

export const updateRegion = (region: Region) => ({
  type: 'UPDATE_REGION',
  region,
});

const updateLocation = (location: Location) => ({
  type: 'UPDATE_LOCATION',
  location,
})

const locationError = (message: string, dispatch: Function) => {
  if (message === 'Location request timed out' || message === 'No available location provider.') {
    dispatch(setLocationError(message))
  }
}

const setLocationError = (message: string) => ({
  type: 'SET_LOCATION_ERROR',
  message,
})

export const getAndSetCurrentLocation = (dispatch: Function) => {
		navigator.geolocation.getCurrentPosition(
      ({ coords }) => dispatch(setInitialLocation(coords)),
      ({ message }) => locationError(message, dispatch),
      {
        enableHighAccuracy: true,
        timeout: 5000,
      }
   );
   watchPosition(dispatch);
}

export const watchPosition = (dispatch: Function) => {
  navigator.geolocation.watchPosition(
    ({ coords }) => dispatch(updateLocation(coords)),
    ({ message }) => locationError(message, dispatch),
    {
      enableHighAccuracy: true,
      timeout: 10000,
      // distanceFilter: 10,
      // maximumAge: 500,
    }
  );
}

export default function location (state: State = initialState, action: Action) {
  switch (action.type) {
    case 'UPDATE_REGION':
        if (action.region.longitudeDelta < 100 && action.region.latitudeDelta && action.region.longitude != 0) {
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
      return { ...state, enabled: false }
    default :
      return state;
  }
}
