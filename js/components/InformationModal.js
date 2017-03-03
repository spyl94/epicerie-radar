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

type Props = {
  visible: boolean,
  position: Object,
  hideModal: () => void,
}

class InformationModal extends Component<{}, Props> {
  state = {
    name: null,
    address: null,
    description: null,
    isLoading: false,
  };

  createIssue = () => {
    const { position, hideModal } = this.props;
    this.setState({ isLoading: true });
    const body = {
      title: 'Un utilisateur vient d\'ajouter des informations.',
      body: `
Position: ${JSON.stringify(position)} ([Streetview](http://maps.google.com/maps?q=&layer=c&cbll=${position.latitude},${position.longitude}&cbp=11,0,0,0,0))
\n\n${JSON.stringify({
  name: this.state.name,
  address: this.state.address,
  coords: {
    latitude: position.latitude,
    longitude: position.longitude,
  },
  description: this.state.description,
  hours: {
    mon_close: "00:00",
    tue_close: "00:00",
    wed_close: "00:00",
    thu_close: "00:00",
    fri_close: "00:00",
    sat_close: "00:00",
    sun_close: "00:00",
  },
})}`};
    Fetcher
    .post('/issues', body)
    .then(() => {
      Alert.alert('Merci pour votre aide!', 'Nous traitons votre message et on ajoute les données à la prochaine mise à jour!');
      this.setState({ description: null, name: null, address: null, isLoading: false });
      hideModal();
    })
    .catch(() => {
      Alert.alert('Un problème est survenu', 'Essayez à nouveau.');
      this.setState({ isLoading: false });
      hideModal();
    });
  }

  render() {
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
              Ajouter une épicerie sur l'app!
            </Text>
            <TextInput
              autoFocus
              style={{ height: 26, marginBottom: 10, padding: 4, borderColor: '#178c80', borderWidth: 0.5 }}
              value={this.state.name}
              placeholder="Nom"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => { this.refs._addressField.focus() }}
              onChangeText={name => this.setState({name})}
            />
            <TextInput
              ref={(c) => { this.refs._addressField = c }}
              style={{ height: 26, marginBottom: 10, padding: 4, borderColor: '#178c80', borderWidth: 0.5 }}
              value={this.state.address}
              placeholder="Adresse"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => { this.refs._descriptionField.focus() }}
              onChangeText={address => this.setState({address})}
            />
            <TextInput
              ref={(c) => { this.refs._descriptionField = c }}
              multiline
              style={{ height: 100, marginBottom: 10, padding: 4, borderColor: '#178c80', borderWidth: 0.5 }}
              value={this.state.description}
              onChangeText={description => this.setState({description})}
              placeholder={`Ouverte en semaine jusqu'à 2h, 5h le week-end`}
              numberOfLines={3}
              onSubmitEditing={() => {this.createIssue(); }}
              returnKeyType="done"
            />
            <Button
              color={this.state.isLoading ? '#31A69A': '#178c80'}
              style={{ marginTop: 10 }}
              disabled={this.state.name === null ||  this.state.isLoading}
              onPress={() => {this.createIssue(); }}
              title={this.state.isLoading ? "Envoi en cours..." : "Envoyer"}
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
