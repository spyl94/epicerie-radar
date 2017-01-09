/* @flow */
type State = {
  location: Object,
  enabled: ?boolean,
  initialRegion: Object,
}

type Action = Object;

const INITIAL_LATITUDE = 48.853;
const INITIAL_LONGITUDE = 2.35;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.0121;

const initialState: State = {
  location: {},
  initialRegion: {
    latitude: INITIAL_LATITUDE,
    longitude: INITIAL_LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  },
  enabled: undefined,
}

const setInitialLocation = (location: Object) => ({
  type: 'SET_INITIAL_LOCATION',
  location,
})

const updateLocation = (location: Object) => ({
  type: 'UPDATE_LOCATION',
  location,
})

const setLocationError = (message: string) => ({
  type: 'SET_LOCATION_ERROR',
  message,
})

export const getAndSetCurrentLocation = (dispatch: Function) => {
		navigator.geolocation.getCurrentPosition(
      ({ coords }) => dispatch(setInitialLocation(coords)),
      ({ message }) => dispatch(setLocationError(message)),
      {
        enableHighAccuracy: true,
        timeout: 5000,
      }
   );
   setTimeout(() => {
     watchPosition(dispatch);
   }, 2000);
}

let watchId = null;
export const watchPosition = (dispatch: Function) => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
  watchId = navigator.geolocation.watchPosition(
    ({ coords }) => dispatch(updateLocation(coords)),
    ({ message }) => dispatch(setLocationError(message)),
    {
      enableHighAccuracy: true,
      timeout: 10000,
      distanceFilter: 10,
      maximumAge: 500,
    }
  );
}

export default function location (state: State = initialState, action: Action) {
  switch (action.type) {
    case 'SET_REGION':
      return { ...state, region: action.region };
    case 'SET_INITIAL_LOCATION':
      const initialRegion = {
        ...state.initialRegion,
        longitude: action.location.longitude,
        latitude: action.location.latitude,
      };
      return { ...state, location: action.location, enabled: true, initialRegion };
    case 'UPDATE_LOCATION':
      return { ...state, location: action.location, enabled: true };
    case 'SET_LOCATION_ERROR':
      return { ...state, enabled: false }
    default :
      return state;
  }
}
