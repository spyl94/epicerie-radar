import { NavigationActions } from 'react-navigation';
import AppNavigator from '../../components/AppNavigator';

export const navigateToMapScreen = () => ({type: 'SHOW_MAP_SCREEN'});
export const navigateToEditModal = () => ({ type: 'SHOW_EDIT_MODAL' })
export const navigateToCreateModal = () => ({ type: 'SHOW_CREATE_MODAL' })
export const startShowMapScreenTimer = (dispatch: Function) => {
  setTimeout(() => {
    dispatch(navigateToMapScreen())
  }, 6000);
}

export default (state, action) => {
  if (action.type === 'BACK') {
    return AppNavigator.router.getStateForAction(NavigationActions.back(), state);
  }
  if (action.type === 'SHOW_MAP_SCREEN') {
    const route = state.routes[state.index];
    if (route && route.routeName !== 'Map') {
      const screen = NavigationActions.navigate({ routeName: 'Map' });
      return AppNavigator.router.getStateForAction(screen, state);
    }
    return state;
  }
  if (action.type === 'SHOW_CREATE_MODAL') {
      const screen = NavigationActions.navigate({ routeName: 'CreateModal' });
      return AppNavigator.router.getStateForAction(screen, state);
  }
  if (action.type === 'SHOW_EDIT_MODAL') {
      const screen = NavigationActions.navigate({ routeName: 'EditModal' });
      return AppNavigator.router.getStateForAction(screen, state);
  }
  return AppNavigator.router.getStateForAction(action, state) || state;
};
