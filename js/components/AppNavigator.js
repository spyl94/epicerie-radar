// @flow
import { StackNavigator } from 'react-navigation';
import MapScreen from './MapScreen';
import LaunchScreen from './LaunchScreen';
import CreateModal from './CreateModal'
import EditModal from './EditModal'

export default StackNavigator({
  Launch: { screen: LaunchScreen },
  Map: { screen: MapScreen },
  CreateModal: { screen: CreateModal },
  EditModal: { screen: EditModal },
});
