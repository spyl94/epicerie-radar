/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import FirstScreen from './FirstScreen';
import NavBar from './NavBar';

const INITIAL_LATITUDE = 48.853;
const INITIAL_LONGITUDE = 2.35;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.0121;

const markerImage = require('../img/beer-marker.png');

class App extends Component {
  state = {
    lastPosition: {
      latitude: INITIAL_LATITUDE,
      longitude: INITIAL_LONGITUDE,
    },
    geolocated: false,
  };

  watchID: ?number = null;

  setPosition = position => {
      this.setState({
        geolocated: true,
        lastPosition: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        },
      });
  }

  componentDidMount() {
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

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    const { markers, dispatch } = this.props;
    const { lastPosition, geolocated } = this.state;
    if (!geolocated) {
      return <FirstScreen />;
    }
    return (
      <View style={styles.container}>
        <NavBar />
        <MapView
          style={styles.map}
          showsUserLocation
          followsUserLocation
          region={{
                latitude: lastPosition.latitude,
                longitude: lastPosition.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          {
            markers.map((marker, key) =>
              <Marker
                key={key}
                coordinate={marker.coords}
                title={marker.name}
                description={marker.address}
                title={marker.name}
                image={markerImage}
              />
            )
          }
          <View style={styles.selectedMarker}>
            <Text style={{ marginTop: 15 }}>
              Epicerie Bidule
            </Text>
          </View>
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   flexDirection: 'column',
   backgroundColor: '#F5FCFF',
 },
 selectedMarker: {
    height: 50,
    backgroundColor: 'powderblue',
 },
 map: {
   flex: 0.6,
  //  ...StyleSheet.absoluteFillObject,
 },
});

export default connect(
  state => ({ markers: state.epiceries })
)(App);
