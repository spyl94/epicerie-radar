/* @flow */
import { combineReducers } from 'redux';
import data from '../data.json';

const SELECT = 'epicerie/SELECT';

const initialState = {
    epiceries: data,
    currentSelected: null,
};

function epiceries(state = initialState.epiceries, action) {
    switch (action.type) {
        default:
            return state;
    }
}

export default combineReducers({
    epiceries,
});
