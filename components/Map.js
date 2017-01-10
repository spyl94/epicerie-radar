/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { select } from '../redux/modules/epicerie';
import markers from '../data.json';
import { openingStatus, getMarkerImage } from '../redux/modules/epicerie';

class Map extends Component {

  render(): React.Element<any> {
    const { initialRegion, currentIndex, select } = this.props;
    return (
        <MapView
          style={styles.map}
          showsUserLocation
          followsUserLocation
          moveOnMarkerPress
          pitchEnabled={false}
          initialRegion={initialRegion}
        >
          {
            markers.map((marker, key) =>
              <Marker
                key={key}
                onPress={() => { select(key) }}
                coordinate={marker.coords}
                image={getMarkerImage(
                  openingStatus(marker).type,
                  currentIndex === key
                )}
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
