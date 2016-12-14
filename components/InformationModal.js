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

class InformationModal extends Component {
  state = {
    text: null,
  };

  render() {
    const { modalVisible } = this.props;
    return (
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
              fetch('https://api.github.com/repos/spyl94/epicerie-radar/issues', {
                  method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'token ' + Config.GH_TOKEN,
                    'User-Agent': 'Epicerie Radar',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'Un utilisateur vient d\'ajouter des informations.',
                    body: this.state.text,
                })
              })
              .then(res => res.json())
              .then(res => {
                this.setState({ text: null });
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
        );
    }
}

const styles = StyleSheet.create({
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
});

export default connect(
  state => ({ modalVisible: state.default.modalVisible }),
  ({ hideModal })
)(InformationModal);
