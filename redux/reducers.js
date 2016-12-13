/* @flow */
import { combineReducers } from 'redux';
import data from '../data.json';
import { List } from 'immutable';

const SELECT = 'epicerie/SELECT';
const SHOW_MODAL = 'epicerie/SHOW_MODAL';
const HIDE_MODAL = 'epicerie/HIDE_MODAL';

const initialState = {
    epiceries: data,
    currentSelected: null,
    modalVisible: false,
};

export const select = (marker: Object) => ({
  type: SELECT,
  marker,
})

export const showModal = () => ({
  type: SHOW_MODAL,
})

export const hideModal = () => ({
  type: HIDE_MODAL,
})

function epiceries(state = initialState, action) {
    switch (action.type) {
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
