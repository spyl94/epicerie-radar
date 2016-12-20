/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import FirstScreen from './FirstScreen';
import NavBar from './NavBar';
import Map from './Map';
import { firstScreenLoader } from '../redux/reducers';
import { getAndSetCurrentLocation } from '../redux/reducers/location';
import InformationModal from './InformationModal';
import SelectedEpicerie from './SelectedEpicerie';
import markers from '../data.json';

class App extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    firstScreenLoader(dispatch);
    if (Platform.OS === 'android') {
      PermissionsAndroid
        .requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(granted => {
          if (granted) getAndSetCurrentLocation(dispatch);
        });
    } else {
      getAndSetCurrentLocation(dispatch);
    }
  }

  render() {
    const { showMap, locationEnabled, currentIndex } = this.props;
    if (showMap || locationEnabled) {
      return (
        <View style={styles.container}>
          <NavBar />
          <InformationModal />
          <Map />
          {
            currentIndex &&
              <SelectedEpicerie epicerie={markers[currentIndex]} />
          }
        </View>
      );
    }
    return <FirstScreen />
  }
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   margin: 0,
   padding: 0,
   flexDirection: 'column',
   backgroundColor: '#F5FCFF',
 },
});

export default connect(
  state => ({
    locationEnabled: state.location.locationEnabled,
    currentIndex: state.default.currentSelected,
    showMap: state.default.showMap,
  })
)(App);
