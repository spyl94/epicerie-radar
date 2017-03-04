import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  TextInput,
  View,
  Button,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { hideEditModal as hideModal } from '../redux/modules/application';
import Modal from 'react-native-simple-modal';
import Fetcher from '../services/Fetcher';

type Props = {
  visible: boolean,
  epicerie: Object,
  hideModal: () => void,
}

class EditModal extends Component<{}, Props> {
  state = {
    description: null,
    isLoading: false,
  };

  createIssue = () => {
    const { hideModal, epicerie } = this.props;
    this.setState({ isLoading: true });
    const body = {
      title: 'Un utilisateur vient de modifier les horraires.',
      body: `Epicerie à modifier: ${JSON.stringify(epicerie)} => ${this.state.description}`,
    };
    Fetcher
    .post('/issues', body)
    .then(() => {
      Alert.alert('Merci pour votre aide!', 'Nous traitons votre message aussi vite que possible!');
      this.setState({ description: null, isLoading: false });
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
              Modifier les horraires de cette épicerie
            </Text>
            <TextInput
              ref={(c) => { this.refs._descriptionField = c }}
              multiline
              style={styles.inputMultiline}
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

const styles = StyleSheet.create({
  inputMultiline: {
    height: 100,
    marginBottom: 10,
    padding: 4,
    ...Platform.select({
      ios: {
        borderColor: '#178c80',
        borderWidth: 0.5
      }
    }),
  }
});

export default connect(
  state => ({
    visible: state.application.editModalVisible,
    epicerie: state.epicerie.currentSelected && state.epicerie.markers[state.epicerie.currentSelected],
  }),
  ({ hideModal })
)(EditModal);
