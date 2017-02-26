// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { select, getMarkerImage } from '../redux/modules/epicerie';
import { updateRegion } from '../redux/modules/location';

class Map extends Component {

  render() {
    const { markers, updateRegion, region, currentIndex, select } = this.props;
    return (
        <MapView
          style={styles.map}
          showsUserLocation
          followsUserLocation
          moveOnMarkerPress
          pitchEnabled={false}
          rotateEnabled={false}
          region={region}
          onRegionChangeComplete={region => {
            updateRegion(region)
          }}
        >
          {
            markers.map((marker, key) =>
              <Marker
                key={key}
                onPress={() => { select(key) }}
                coordinate={marker.coords}
                anchor={{x: 0.5, y: 0.5}}
                image={getMarkerImage(marker.type, currentIndex === key)}
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
    region: state.location.region,
    currentIndex: state.epicerie.currentSelected,
    markers: state.epicerie.markers,
  }),
  ({ select, updateRegion })
)(Map);
