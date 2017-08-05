import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';
import type {
  State as EpicerieState,
  EpicerieAction,
} from './redux/modules/epicerie';
import type {
  State as LocationState,
  LocationAction,
} from './redux/modules/location';

export type LatLng = {
  latitude: number,
  longitude: number,
};

export type Marker = {
  name: String,
  address: String,
  coords: {
    latitude: number,
    longitude: number,
  },
  horairesAreKnown: ?String,
  hours: {
    mon_open: ?String,
    mon_close: ?String,
    thu_open: ?String,
    thu_close: ?String,
    tue_open: ?String,
    tue_close: ?String,
    wed_open: ?String,
    fri_open: ?String,
    sat_open: ?String,
    sun_open: ?String,
    wed_close: ?String,
    fri_close: ?String,
    sat_close: ?String,
    sun_close: ?String,
  },
};
export type Markers = Array<Marker>;

type Action = EpicerieAction | LocationAction;
export type State = {
  form: Object,
  nav: Object,
  epicerie: EpicerieState,
  location: LocationState,
};

export type Store = ReduxStore<State, Action>;
export type Dispatch = ReduxDispatch<Action>;
