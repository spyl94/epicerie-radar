// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { select } from '../redux/modules/epicerie';
import { getMarkerImage } from '../services/markerHelper';
import { updateRegion } from '../redux/modules/location';
import { updateMarkerWithLocationData } from '../redux/modules/epicerie';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: [],
    };
  }

  componentDidMount() {
    const { location, markers, currentIndex, updateMarker } = this.props;
    updateMarker(location, markers[currentIndex]);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentIndex != this.props.currentIndex) {
      const { location, markers, currentIndex, updateMarker } = this.props;
      updateMarker(location, markers[currentIndex]);
    }
  }

  render() {
    const { markers, update, region, currentIndex, select } = this.props;
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
        }}>
        {markers.map((marker, index) =>
          <Marker
            key={marker.id}
            onPress={() => {
              select(index);
            }}
            coordinate={marker.coords}
            anchor={{ x: 0.5, y: 0.5 }}
            image={getMarkerImage(marker.type, currentIndex === index)}
          />,
        )}
        {
          markers[currentIndex].lineCoordinates &&
          <MapView.Polyline
            coordinates={markers[currentIndex].lineCoordinates}
            strokeWidth={3}
            strokeColor="#178c80"
          />
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

const mapDispatchToProps = (dispatch: Function) => ({
  select: id => {
    dispatch(select(id));
  },
  update: region => {
    dispatch(updateRegion(region));
  },
  updateMarker: (location, marker) => {
    updateMarkerWithLocationData(location, marker, dispatch);
  }
});

const mapStateToProps = state => ({
  region: state.location.region,
  location: state.location.location,
  currentIndex: state.epicerie.currentSelected,
  markers: Object.keys(state.epicerie.markers).map(key => state.epicerie.markers[key]),
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
