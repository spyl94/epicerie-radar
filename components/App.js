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
import MapView, { Marker } from 'react-native-maps';
import data from '../data.json'

const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.0121;

const markerImage = require('../img/beer-marker.png');

export default class App extends Component {
  state = {
    initialCoords: null,
    lastPosition: null,
    markers: data,
  };

  watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const initialCoords = {
          long: position.coords.longitude,
          lat: position.coords.latitude,
        };
        this.setState({
          initialCoords,
          lastPosition: initialCoords
        });
    },
      error => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000}
    );
    this.watchID = navigator.geolocation.watchPosition(data => {
      const lastPosition = {
        long: data.coords.longitude,
        lat: data.coords.latitude,
      };
      this.setState({lastPosition});
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    const { lastPosition, markers } = this.state;
    return (
      <View style={styles.container}>
        {
          lastPosition
            ? <MapView
              style={styles.map}
              showsUserLocation
              region={{
                latitude: lastPosition.lat,
                longitude: lastPosition.long,
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
                    image={markerImage}
                  />
                )
              }
            </MapView>
          : <Text style={styles.welcome}>
            Receiving GPS information...
            <Image
              source={markerImage}
            />
          </Text>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
});
