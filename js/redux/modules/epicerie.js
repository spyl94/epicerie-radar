import data from '../../../data.json';
import Fetcher from '../../services/Fetcher'
import { Alert } from 'react-native'
import { findNearestIndex, openingStatus } from '../../services/markerHelper';
import type { Marker, Markers, Dispatch } from '../../types';

type State = {
  currentSelected: ?Marker,
  markers: Markers,
  isReporting: boolean,
}
export type EpicerieAction =
  { type: 'LOAD_MARKERS', markers: Markers } |
  { type: 'SELECT', marker: Marker } |
  { type: 'REPORTING' } |
  { type: 'STOP_REPORTING' } |
  { type: 'SET_INITIAL_LOCATION' }
;

const initialState: State = {
    currentSelected: null,
    markers: [],
    isReporting: false,
};

export const reportNotExisting = (dispatch: Dispatch, epicerie: Marker) => {
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

export const loadUpToDateMarkers = (dispatch: Dispatch) => {
  Fetcher
    .get('https://raw.githubusercontent.com/spyl94/epicerie-radar/master/data.json')
    .then((markers: Markers) => {
      dispatch({ type: 'LOAD_MARKERS', markers });
    })
    .catch(() => {
      dispatch({ type: 'LOAD_MARKERS', markers: data });
    });
}

export const select = (marker: Marker) => ({
  type: 'SELECT',
  marker,
})

const INITIAL_LATITUDE = 48.853;
const INITIAL_LONGITUDE = 2.35;

export default function epiceries(state: State = initialState, action: EpicerieAction): State {
    switch (action.type) {
      case 'LOAD_MARKERS': {
          const markers = [];
          let i = 0;
          for (const epicerie of action.markers) {
            markers.push({
              ...epicerie,
              ...openingStatus(epicerie),
              id: i
            });
            i++;
          }
          const currentSelected = findNearestIndex(markers, INITIAL_LATITUDE, INITIAL_LONGITUDE);
          return {...state, markers: markers, currentSelected  };
        }
        case 'SET_INITIAL_LOCATION': {
          const currentSelected = findNearestIndex(state.markers, action.location.latitude, action.location.longitude);
          return {...state, currentSelected };
        }
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
