/**
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView from 'react-native-maps';
import data from './data'

export default class epicerie extends Component {
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
        this.setState({initialCoords, lastPosition: initialCoords});
      },
      (error) => alert(JSON.stringify(error)),
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
    return (
      <View style={styles.container}>
        {
          this.state.lastPosition
            ? <MapView
                style={styles.map}
                region={{
                  latitude: this.state.lastPosition.lat,
                  longitude: this.state.lastPosition.long,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
              >
              {
                this.state.markers.map((marker, key) =>
                  <MapView.Marker
                      key={key}
                      coordinate={marker.coords}
                      title={marker.name}
                  />
                )
              }
              </MapView>
            : <Text style={styles.welcome}>
                Receiving GPS information...
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


AppRegistry.registerComponent('epicerie', () => epicerie);
