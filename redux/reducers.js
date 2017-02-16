/* @flow */
import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import location from './modules/location';
import epicerie from './modules/epicerie';
import application from './modules/application';
import AppNavigator from '../components/AppNavigator';

export default combineReducers({
    nav: (state, action) => {
      if (action.type === 'Logout') {
        return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), state);
      }
      return AppNavigator.router.getStateForAction(action, state)
    },
    application,
    epicerie,
    location,
});
