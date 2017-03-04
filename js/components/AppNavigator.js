// @flow
import { StackNavigator } from 'react-navigation';
import MapScreen from './MapScreen';
import LaunchScreen from './LaunchScreen';

export default StackNavigator({
  Launch: { screen: LaunchScreen },
  Map: { screen: MapScreen },
});
