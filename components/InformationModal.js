import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  TextInput,
  View,
  Button,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { hideModal } from '../redux/modules/application';
import Modal from 'react-native-simple-modal';
import Fetcher from '../services/Fetcher';

class InformationModal extends Component {
  state = {
    text: null,
    isLoading: false,
  };

  createIssue = () => {
    const { position, hideModal } = this.props;
    this.setState({ isLoading: true });
    const body = {
      title: 'Un utilisateur vient d\'ajouter des informations.',
      body: `Position: ${JSON.stringify(position)} ([Streetview](http://maps.google.com/maps?q=&layer=c&cbll=${position.latitude},${position.longitude}&cbp=11,0,0,0,0))\nInformations: ${this.state.text || ''}`,
    };
    Fetcher
    .post('/issues', body)
    .then(() => {
      Alert.alert('Merci pour votre aide!', 'Nous traitons votre message et on ajoute les données à la prochaine mise à jour!');
      this.setState({ text: null, isLoading: false });
      hideModal();
    })
    .catch(() => {
      Alert.alert('Un problème est survenu', 'Essayez à nouveau.');
      this.setState({ isLoading: false });
      hideModal();
    });
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
              blurOnSubmit={false}
              returnKeyType="done"
            />
            <Button
              color={this.state.isLoading ? '#31A69A': '#178c80'}
              style={{ marginTop: 10 }}
              disabled={this.state.text === null ||  this.state.isLoading}
              onPress={() => {this.createIssue(); }}
              title={this.state.isLoading ? "Envoi en cours..." : "Envoyer avec ma position"}
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
