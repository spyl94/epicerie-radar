// @flow
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import location from './modules/location';
import epicerie from './modules/epicerie';
import nav from './modules/nav';

export default combineReducers({
    nav,
    epicerie,
    location,
    form,
});
