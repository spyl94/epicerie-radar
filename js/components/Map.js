// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { select } from '../redux/modules/epicerie';
import { getMarkerImage } from '../services/markerHelper';
import { updateMarkerWithLocationData } from '../redux/modules/epicerie';

const initialRegion = {
  latitude: 48.853,
  longitude: 2.35,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

class Map extends Component {

  componentDidMount() {
    const { geolocated, location, markers, currentIndex, updateMarker } = this.props;
    if (markers[currentIndex]) {
      if (geolocated) {
        updateMarker(location, markers[currentIndex]);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const map = this._map;
    const { setGeolocated, location, locationToUpdate, geolocated, markers, currentIndex, updateMarker } = this.props;
    const currentMarker = markers[currentIndex];
    // An epicerie has just been selected
    if (prevProps.currentIndex != currentIndex) {
      if (currentMarker) {
        if (geolocated) {
          updateMarker(location, currentMarker);
        }
        if (map) {
          map.animateToCoordinate(currentMarker.coords);
        }
      }
    }
    // GPS has just been enabled
    if (!prevProps.geolocated && geolocated && locationToUpdate) {
      if (map) {
        map.animateToRegion({...initialRegion, ...locationToUpdate});
        setGeolocated();
      }
    }
  }

  render() {
    const { setGeolocated, geolocated, locationToUpdate, markers, currentIndex, select } = this.props;
    const currentMarker = markers[currentIndex];
    return (
      <MapView
        style={styles.map}
        onMapReady={() => {
          if (geolocated && locationToUpdate) {
            this._map.animateToRegion({...initialRegion, ...locationToUpdate});
            setGeolocated();
          }
        }}
        ref={(c) => { this._map = c; }}
        initialRegion={initialRegion}
        showsUserLocation
        followsUserLocation
        moveOnMarkerPress
        pitchEnabled={false}
        rotateEnabled={false}
        >
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
          currentMarker && currentMarker.lineCoordinates &&
          <MapView.Polyline
            coordinates={currentMarker.lineCoordinates}
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
  setGeolocated: () => {
    dispatch({ type: 'SET_GEOLOCATED'});
  },
  updateMarker: (location, marker) => {
    updateMarkerWithLocationData(location, marker, dispatch);
  }
});

const mapStateToProps = state => ({
  location: state.location.location,
  locationToUpdate: state.location.locationToUpdate,
  geolocated: state.location.geolocated,
  currentIndex: state.epicerie.currentSelected,
  markers: Object.keys(state.epicerie.markers).map(key => state.epicerie.markers[key]),
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
