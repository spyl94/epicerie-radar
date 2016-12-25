/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { select } from '../redux/modules/epicerie';
import markers from '../data.json';

const markerSelected = undefined;
const markerImage = require('../img/beer-marker.png');

class Map extends Component {

  render(): React.Element<any> {
    const { initialRegion, currentIndex, select } = this.props;
    return (
        <MapView
          style={styles.map}
          showsUserLocation
          followsUserLocation
          moveOnMarkerPress
          initialRegion={initialRegion}
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
    );
  }
}

const styles = StyleSheet.create({
 map: {
   flex: 0.6,
   margin: 0,
 },
});

export default connect(
  state => ({
    initialRegion: state.location.initialRegion,
    currentIndex: state.epicerie.currentSelected,
  }),
  ({ select })
)(Map);
