/* @flow */
import { combineReducers } from 'redux';
import location from './modules/location';
import epicerie from './modules/epicerie';
import application from './modules/application';

export default combineReducers({
    application,
    epicerie,
    location,
});
