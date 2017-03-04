import { NavigationActions } from 'react-navigation';
import AppNavigator from '../../components/AppNavigator';

export default (state, action) => {
  if (action.type === 'SHOW_MAP_SCREEN') {
    const route = state.routes[state.index];
    if (route && route.routeName !== 'Map') {
      const screen = NavigationActions.navigate({ routeName: 'Map' });
      return AppNavigator.router.getStateForAction(screen, state);
    }
    return state;
  }
  return AppNavigator.router.getStateForAction(action, state) || state;
};
