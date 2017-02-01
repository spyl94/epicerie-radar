/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import supercluster from 'supercluster';
import MapView, { View, Marker } from 'react-native-maps';
import { select, getMarkerImage } from '../redux/modules/epicerie';
import { updateRegion } from '../redux/modules/location';

class Map extends Component {


  getZoomLevel(region = this.state.region) {
    // http://stackoverflow.com/a/6055653
    const angle = region.longitudeDelta;

    // 0.95 for finetuning zoomlevel grouping
    return Math.round(Math.log(360 / angle) / Math.LN2);
  }

  // componentWillReceiveProps(nextProps) {
  //   // if (nextProps.lastRequestedUserLocationAt > this.props.lastRequestedUserLocationAt) {
  //   //   this.centerMapToUser(nextProps.currentLocation);
  //   // }
  //
  //   // if (nextProps.lastUpdated > this.props.lastUpdated) {
  //     // const markers = this.createMarkersForLocations(nextProps);
  //     // const markers = nextProps.markers;
  //     // const clusters = {};
  //     const index = supercluster({
  //       radius: 60,
  //       maxZoom: 16,
  //     });
  //     index.load(markers);
  //     const padding = 0.25;
  //     const clusters = index.getClusters([
  //         region.longitude - (region.longitudeDelta * (0.5 + padding)),
  //         region.latitude - (region.latitudeDelta * (0.5 + padding)),
  //         region.longitude + (region.longitudeDelta * (0.5 + padding)),
  //         region.latitude + (region.latitudeDelta * (0.5 + padding)),
  //     ], this.getZoomLevel());
  //
  //
  //     // markers.forEach(marker => {
  //         // Recalculate cluster trees
  //         const cluster = supercluster({
  //           radius: 60,
  //           maxZoom: 16,
  //         });
  //
  //         cluster.load(markers[categoryKey]);
  //
  //         clusters[categoryKey] = cluster;
  //       });
  //
  //       this.setState({
  //         clusters
  //       });
  //     }
  //   // }
  // }

  render(): React.Element<any> {
    const { markers, updateRegion, region, currentIndex, select } = this.props;
    const index = supercluster({
      radius: 60,
      maxZoom: 16,
    });
    index.load(markers);
    const padding = 0.25;
    const clusters = index.getClusters([
        region.longitude - (region.longitudeDelta * (0.5 + padding)),
        region.latitude - (region.latitudeDelta * (0.5 + padding)),
        region.longitude + (region.longitudeDelta * (0.5 + padding)),
        region.latitude + (region.latitudeDelta * (0.5 + padding)),
    ], this.getZoomLevel());
    console.log(clusters);
    return (
        <MapView
          style={styles.map}
          showsUserLocation
          followsUserLocation
          moveOnMarkerPress
          pitchEnabled={false}
          rotateEnabled={false}
          region={region}
          onRegionChangeComplete={region => { updateRegion(region); }}
        >
          {
            clusters.map((marker, key) =>
              <Marker
                key={key}
                // onPress={() => { select(key) }}
                coordinate={marker.coords}
              >
                <View style={styles.clusterContainer}>
                  <Text style={styles.clusterText}>
                    {/* {cluster.getTotalPoints()} */}
                    { 2 }
                  </Text>
                </View>
              </Marker>
            )
          }
          {/* {
            markers.map((marker, key) =>
            <Marker
            key={key}
            onPress={() => { select(key) }}
            coordinate={marker.coords}
            anchor={{x: 0.5, y: 0.5}}
            image={getMarkerImage(marker.type, currentIndex === key)}
            />
            )
          } */}
        </MapView>
    );
  }
}

const styles = StyleSheet.create({
  map: {
   flex: 0.6,
   margin: 0,
  },
  clusterContainer: {
    backgroundColor: '#666',
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
  },
  clusterText: {
    color: '#fff',
    fontSize: 12,
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
