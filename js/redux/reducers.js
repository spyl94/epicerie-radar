// @flow
import { combineReducers } from 'redux';
import location from './modules/location';
import epicerie from './modules/epicerie';
import nav from './modules/nav';

export default combineReducers({
    nav,
    epicerie,
    location,
});
