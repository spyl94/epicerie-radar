/**
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';
import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge';
import MapView, { Marker } from 'react-native-maps';
import data from '../data.json'

const INITIAL_LATITUDE = 48.853;
const INITIAL_LONGITUDE = 2.35;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.0121;

const markerImage = require('../img/beer-marker.png');
const logo = require('../android/app/src/main/res/playstore-icon.png');
const tracker = new GoogleAnalyticsTracker('UA-87371140-1');

export default class App extends Component {
  state = {
    lastPosition: {
      latitude: INITIAL_LATITUDE,
      longitude: INITIAL_LONGITUDE,
    },
    markers: data,
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
    const { lastPosition, markers, geolocated } = this.state;
    return (
      <View style={styles.container}>
        {
          geolocated
            ? <MapView
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
            </MapView>
          : <View style={styles.loadingScreen}>
            <Image style={styles.logo} source={logo} />
            <Text style={{ marginTop: 15 }}>
              Récupération de votre position...
            </Text>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
 },
 loadingScreen: {
   flex: 1,
   flexDirection: 'column',
   justifyContent: 'center',
   alignItems: 'center',
 },
 logo: {
   width: 150,
   height: 150,
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
});
