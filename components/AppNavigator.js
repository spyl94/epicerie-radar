// @flow
import { StackNavigator } from 'react-navigation';
import MapScreen from './MapScreen';
import LaunchScreen from './LaunchScreen';

const AppNavigator = StackNavigator({
  Launch: { screen: LaunchScreen },
  Map: { screen: MapScreen },
});

export default AppNavigator;
