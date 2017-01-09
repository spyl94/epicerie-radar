/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import Button from 'react-native-button';
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
      Alert.alert('Merci pour votre aide!', 'Nous traitons votre message et on ajoute les données à la prochaine mise à jour!');
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
        offset={-300}
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
          <View>
            <Text style={{ paddingBottom: 10, fontWeight: 'bold' }}>
              Aidez nous à améliorer l'app!
            </Text>
            <TextInput
              multiline
              autoFocus
              style={{ height: 300, borderColor: '#178c80', borderWidth: 1 }}
              value={this.state.text}
              onChangeText={text => this.setState({text})}
              placeholder={`Exemple d'infos:\n\nVoici une épicerie non référencée: Alimentation générale, \n9 rue Voltaire\nOuverte du lundi au dimanche de 9h à 2h\n\nou\n\nL'épicerie indiquée n\'existe pas!`}
              numberOfLines={10}
            />
            <Button
              containerStyle={{
                    padding: 12,
                    marginTop: 10,
                    overflow: 'hidden',
                    borderRadius: 4,
                    backgroundColor: this.state.isLoading ? '#31A69A': '#178c80'
              }}
              style={{ fontSize: 12, color: 'white' }}
              disabled={this.state.text === null ||  this.state.isLoading}
              onPress={() => {this.createIssue(); }}
            >
              {
                this.state.isLoading
                ? "Envoi en cours..."
                : "Envoyer avec ma position"
              }
            </Button>
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
