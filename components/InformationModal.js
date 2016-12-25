/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  TextInput,
  View,
  Button,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Config from 'react-native-config';
import { hideModal } from '../redux/modules/application';
import Modal from 'react-native-simple-modal';

class InformationModal extends Component {
  state = {
    text: null,
    isLoading: false,
  };

  createIssue = () => {
    const { position, hideModal } = this.props;
    this.setState({ isLoading: true });
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
      Alert.alert('Merci de nous aider!', 'Nous traitons votre message, on ajoute les données à la prochaine mise à jour!');
      this.setState({ text: null, isLoading: false });
      hideModal();
    })
    .catch(console.error);
  }

  render(): React.Element<any> {
    const { visible, hideModal } = this.props;
    return (
      <Modal
        open={visible}
        closeOnTouchOutside
        offset={0}
        containerStyle={{
          justifyContent: 'center'
        }}
        modalStyle={{
          borderRadius: 2,
          margin: 20,
          padding: 10,
          backgroundColor: '#F5F5F5'
        }}
        modalDidClose={() => hideModal()}
        overlayBackground={'rgba(0, 0, 0, 0.75)'}
      >
        <KeyboardAwareScrollView>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TextInput
              multiline
              value={this.state.text}
              onChangeText={text => this.setState({text})}
              placeholder={`Exemple:\nAlimentation générale, \n9 rue Voltaire\nOuvert du lundi au dimanche de 9h à 2h\n\nou\n\nCette épicerie n\'existe pas!`}
              numberOfLines={10}
            />
            <Button
              disabled={this.state.text === null ||  this.state.isLoading}
              onPress={() => {this.createIssue(); }}
              // underlayColor="#a9d9d4"
              color="#178c80"
              title="Envoyer les informations à ma position"
            />
          </View>
        </KeyboardAwareScrollView>
      </Modal>
        );
    }
}

export default connect(
  state => ({
    visible: state.application.modalVisible,
    position: state.location.location
  }),
  ({ hideModal })
)(InformationModal);
