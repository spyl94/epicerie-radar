/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Config from 'react-native-config';
import MapView, { Marker } from 'react-native-maps';
import FirstScreen from './FirstScreen';
import NavBar from './NavBar';
import { hideModal } from '../redux/reducers';
import Modal from 'react-native-root-modal';

const cancel = require('../img/cancel.png');

class InformationModal extends Component {
  state = {
    text: null,
  };

  createIssue = () => {
    const { position, hideModal } = this.props;
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
        body: `Position: ${JSON.stringify(position)} ([Streetview](http://maps.google.com/maps?q=&layer=c&cbll=${position.latitude},${position.longitude}&cbp=11,0,0,0,0))\nInformations: ${this.state.text || ''}`,
      })
    })
    .then(() => {
      this.setState({ text: null });
      hideModal();
    })
    .catch(console.error);
  }

  render() {
    const { visible, hideModal } = this.props;
    const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
    return (
      <Modal
        visible={visible}
      >
        <View style={styles.modal}>
          <Touchable onPress={() => { hideModal() }}>
            <View>
              <Image
                style={styles.image}
                source={cancel}
              />
            </View>
          </Touchable>
          <Text style={{ margin: 10, fontWeight: 'bold' }}>Vous souhaitez rajouter une épicerie ou indiquer qu'un emplacement n'est pas correct ?</Text>
          <TextInput
            multiline
            autoFocus
            onChangeText={text => this.setState({text})}
            style={{ width: 300 }}
            placeholder={`Alimentation générale, \n9 rue Voltaire\nOuvert du lundi au dimimanche de 9h à 2h\n\nou\n\nCette épicerie n\'existe pas!`}
            numberOfLines={10}
          />
          <Touchable
            accessibilityComponentType="button"
            disabled={this.state.text === null}
            onPress={() => {this.createIssue(); }}
            style={styles.modalButton}
            underlayColor="#a9d9d4"
          >
            <View style={styles.modalButton}>
              <Text style={{ textAlign: 'center', padding: 8, fontWeight: '500' }}>
                Envoyer les informations à ma position
              </Text>
            </View>
          </Touchable>
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
 image: {
   width: 30,
   height: 30,
   resizeMode: 'contain'
 },
 modalButton: {
   margin: 15,
   backgroundColor: '#178c80',
   borderRadius: 10,
   padding: 15
 },
});

export default connect(
  state => ({
    visible: state.default.modalVisible,
    position: state.default.position
  }),
  ({ hideModal })
)(InformationModal);
