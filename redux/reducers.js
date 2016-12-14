/* @flow */
import { combineReducers } from 'redux';
import data from '../data.json';
import { List } from 'immutable';

const SELECT = 'epicerie/SELECT';
const SHOW_MODAL = 'epicerie/SHOW_MODAL';
const HIDE_MODAL = 'epicerie/HIDE_MODAL';
const UPDATE_POSITION = 'epicerie/UPDATE_POSITION';

const INITIAL_LATITUDE = 48.853;
const INITIAL_LONGITUDE = 2.35;

const initialState = {
    epiceries: data,
    currentSelected: null,
    modalVisible: false,
    position: {
      latitude: INITIAL_LATITUDE,
      longitude: INITIAL_LONGITUDE,
    },
};

export const select = (marker: Object) => ({
  type: SELECT,
  marker,
})

export const updatePosition = (position: Object) => ({
  type: UPDATE_POSITION,
  position,
})

export const showModal = () => ({
  type: SHOW_MODAL,
})

export const hideModal = () => ({
  type: HIDE_MODAL,
})

function epiceries(state = initialState, action) {
    switch (action.type) {
        case UPDATE_POSITION:
          return {...state, 'position': action.position };
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
});
