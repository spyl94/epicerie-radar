// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { select } from '../redux/modules/epicerie';
import { getMarkerImage } from '../services/markerHelper';
import { updateRegion } from '../redux/modules/location';
import { getLineCoords } from '../services/geolocation';

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lineCoords: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentIndex != this.props.currentIndex) {
      this.setState({ lineCoords: [] });
      const currentMarker = this.props.markers[this.props.currentIndex];
      const lineCoords = getLineCoords(this.props.location , currentMarker.coords);
      this.setState({ lineCoords });
    }
  }

  render() {
    const { markers, update, region, currentIndex, select } = this.props;
    const { lineCoords } = this.state;
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
            update(region);
          }}
        >
          {
            markers.map((marker, index) =>
              <Marker
                key={index}
                onPress={() => { select(index) }}
                coordinate={marker.coords}
                anchor={{x: 0.5, y: 0.5}}
                image={getMarkerImage(marker.type, currentIndex === index)}
              />
            )
          }
          <MapView.Polyline
            coordinates={lineCoords}
            strokeWidth={2}
            strokeColor="red"
          />
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

const mapDispatchToProps = (dispatch: Function) => ({
    select: (id) => {
      dispatch(select(id));
    },
    update: (region) => {
      dispatch(updateRegion(region));
    }
});

const mapStateToProps = (state) => ({
  region: state.location.region,
  location: state.location.location,
  currentIndex: state.epicerie.currentSelected,
  markers: state.epicerie.markers,
});

export default connect(mapStateToProps,  mapDispatchToProps)(Map);
