// @flow
import { combineReducers } from 'redux';
import location from './modules/location';
import epicerie from './modules/epicerie';
import nav from './modules/nav';
import application from './modules/application';

export default combineReducers({
    nav,
    application,
    epicerie,
    location,
});
