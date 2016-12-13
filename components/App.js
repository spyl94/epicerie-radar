/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Config from 'react-native-config';
import MapView, { Marker } from 'react-native-maps';
import FirstScreen from './FirstScreen';
import NavBar from './NavBar';
import { select, hideModal } from '../redux/reducers';
import Modal from 'react-native-root-modal';

const INITIAL_LATITUDE = 48.853;
const INITIAL_LONGITUDE = 2.35;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.0121;

const markerSelected = undefined;
const markerImage = require('../img/beer-marker.png');

class App extends Component {
  state = {
    lastPosition: {
      latitude: INITIAL_LATITUDE,
      longitude: INITIAL_LONGITUDE,
    },
    text: null,
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

  watchLocation() {
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

  componentDidMount() {
    if (Platform.OS === 'android') {
      PermissionsAndroid
        .requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(granted => {
          if (granted) this.watchLocation();
        });
    } else {
      this.watchLocation();
    }
  }

  componentWillUnmount() {
    if (this.watchID) {
      navigator.geolocation.clearWatch(this.watchID);
    }
  }

  render() {
    const { markers, current, select, hideModal, modalVisible } = this.props;
    const { lastPosition, geolocated } = this.state;
    if (!geolocated) {
      return <FirstScreen />;
    }
    return (
      <View style={styles.container}>
        <NavBar />
        <Modal
          visible={modalVisible}
        >
          <View style={styles.modal}>
            <Text style={{ margin: 10, fontWeight: 'bold' }}>Vous souhaitez rajouter une épicerie ou indiquer qu'un emplacement n'est pas correct ? C'est possible!</Text>
            <TextInput
              multiline
              autoFocus
              onChangeText={text => this.setState({text})}
              style={{ width: 300 }}
              placeholder={`Alimentation generale, \n9 rue Voltaire\nOuvert du lundi au dimimanche de 9h à 2h\n\nou\n\nCette épicerie n\'existe pas!`}
              numberOfLines={10}
            />
            <TouchableHighlight
              onPress={() => {
                fetch('https://api.github.com/repos/spyl94/epicerie-radar/issues/', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Authorization': 'token ' + Config.GH_TOKEN,
                    'User-Agent': 'Epicerie Radar',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    title: 'Un utilisateur vient d\'ajouter des informations.',
                    body: 'Test',
                  })
                })
                .then(res => res.json())
                .then(res => {
                  this.setState({text: null});
                  hideModal();
                })
                .catch(console.error);
              }}
              style={styles.modalButton}
              underlayColor="#a9d9d4"
            >
              <Text>Envoyer les informations à ma position</Text>
            </TouchableHighlight>
          </View>
        </Modal>
        <MapView
          style={styles.map}
          showsUserLocation
          followsUserLocation
          moveOnMarkerPress={false}
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
                onPress={() => { select(key); }}
                coordinate={marker.coords}
                image={
                  current === key
                  ? markerSelected
                  : markerImage
                }
              />
            )
          }
        </MapView>
        {
          current && markers[current] &&
            <View style={styles.selectedMarker}>
              <Text style={{ fontWeight: 'bold' }}>
                {markers[current].name}
              </Text>
              <Text>
                {markers[current].address}
              </Text>
              <Text style={{ marginTop: 20 }}>
                Les horaires de cette épicerie seront bientôt disponible!
              </Text>
            </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   margin: 0,
   flexDirection: 'column',
   backgroundColor: '#F5FCFF',
 },
 selectedMarker: {
    margin: 0,
    flex: 0.1,
    paddingTop: 15,
    paddingLeft: 15
 },
 modal: {
   width: 320,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: 'rgba(255, 255, 255, 0.8)',
   borderRadius: 10,
   overflow: 'hidden'
 },
 modalButton: {
   margin: 15,
   backgroundColor: '#178c80',
   borderRadius: 10,
   padding: 15
 },
 map: {
   flex: 0.6,
   margin: 0,
 },
});

export default connect(
  state => ({
    markers: state.default.epiceries,
    current: state.default.currentSelected,
    modalVisible: state.default.modalVisible,
  }),
  ({select, hideModal })
)(App);
