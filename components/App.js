/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import FirstScreen from './FirstScreen';
import NavBar from './NavBar';
import { select, updatePosition } from '../redux/reducers';
import InformationModal from './InformationModal';
import SelectedEpicerie from './SelectedEpicerie';

const INITIAL_LATITUDE = 48.853;
const INITIAL_LONGITUDE = 2.35;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.0121;

const markerSelected = undefined;
const markerImage = require('../img/beer-marker.png');

class App extends Component {
  state = {
    lastPosition: {
      latitude: INITIAL_LATITUDE,
      longitude: INITIAL_LONGITUDE,
    },
    text: null,
    geolocated: false,
  };

  watchID: ?number = null;

  setPosition = position => {
      this.props.updatePosition(position.coords);
      this.setState({ geolocated: true });
  }

  watchLocation() {
    navigator.geolocation.getCurrentPosition(
      this.setPosition,
      error => this.setState({ geolocated: true }),
      {
        enableHighAccuracy: true,
        timeout: 5000
      }
    );
    this.watchID = navigator.geolocation.watchPosition(this.setPosition);
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      PermissionsAndroid
        .requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(granted => {
          if (granted) this.watchLocation();
        });
    } else {
      this.watchLocation();
    }
  }

  componentWillUnmount() {
    if (this.watchID) {
      navigator.geolocation.clearWatch(this.watchID);
    }
  }

  render() {
    const { position, markers, currentIndex, select } = this.props;
    const { geolocated } = this.state;
    if (!geolocated) {
      return <FirstScreen />;
    }
    return (
      <View style={styles.container}>
        <NavBar />
        <InformationModal />
        <MapView
          style={styles.map}
          showsUserLocation
          followsUserLocation
          moveOnMarkerPress={false}
          region={{
            ...position,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          {
            markers.map((marker, key) =>
              <Marker
                key={key}
                onPress={() => { select(key); }}
                coordinate={marker.coords}
                image={
                  currentIndex === key
                  ? markerSelected
                  : markerImage
                }
              />
            )
          }
        </MapView>
        {
          currentIndex &&
            <SelectedEpicerie epicerie={markers[currentIndex]} />
        }
      </View>
    );
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
 map: {
   flex: 0.6,
   margin: 0,
 },
});

export default connect(
  state => ({
    markers: state.default.epiceries,
    currentIndex: state.default.currentSelected,
    position: state.default.position,
  }),
  ({ select, updatePosition })
)(App);
