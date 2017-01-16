/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import FirstScreen from './FirstScreen';
import NavBar from './NavBar';
import Map from './Map';
import LocationInfo from './LocationInfo';
import { startShowMapScreenTimer } from '../redux/modules/application';
import { getAndSetCurrentLocation } from '../redux/modules/location';
import InformationModal from './InformationModal';
import SelectedEpicerie from './SelectedEpicerie';

class App extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    startShowMapScreenTimer(dispatch);
    if (Platform.OS === 'android') {
      PermissionsAndroid
        .request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(() => {
          getAndSetCurrentLocation(dispatch);
        });
    } else {
      getAndSetCurrentLocation(dispatch);
    }
  }

  render(): React.Element<any> {
    const { showMap, locationEnabled } = this.props;
    if (showMap) {
      return (
        <View style={styles.container}>
          <NavBar />
          <LocationInfo enabled={locationEnabled} />
          <Map />
          <SelectedEpicerie />
          <InformationModal />
        </View>
      );
    }
    return <FirstScreen />
  }
}

const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
   margin: 0,
   padding: 0,
   backgroundColor: '#F5FCFF',
 },
});

export default connect(
  state => ({
    locationEnabled: state.location.enabled,
    currentIndex: state.epicerie.currentSelected,
    showMap: state.application.showMap,
  })
)(App);
