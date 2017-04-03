import React, {Component} from 'react';
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
import Fetcher from '../services/Fetcher';

type Props = {
  position: Object,
}

const isValid= (state) => {
  return state.name && state.address;
}

class CreateModal extends Component<{}, Props> {
  static navigationOptions = {
    header: {
      title: 'Ajouter une épicerie',
    },
  };

  state = {
    name: null,
    address: null,
    description: null,
    isLoading: false,
  };

  createIssue = () => {
    const { position } = this.props;
    const { name, address, description } = this.state;
    this.setState({ isLoading: true });
    const body = {
      title: 'Un utilisateur vient d\'ajouter des informations.',
      body: `
**Nouvelle épicerie**
\`\`\`json
${JSON.stringify({
  name,
  address,
  coords: {
    latitude: null,
    longitude: null,
  },
  description,
}, undefined, 2)}
\`\`\`
**Position de l'utilisateur**
\n\n
\`${JSON.stringify(position, undefined, 2)}\` ([Streetview](http://maps.google.com/maps?q=&layer=c&cbll=${position.latitude},${position.longitude}&cbp=11,0,0,0,0))
`};
    Fetcher
    .post('/issues', body)
    .then(() => {
      Alert.alert('Merci pour votre aide!', 'Nous traitons votre message et on ajoute les données à la prochaine mise à jour!');
      this.setState({ description: null, name: null, address: null, isLoading: false });
      this.props.dispatch({ type: 'BACK' })
    })
    .catch(() => {
      Alert.alert('Un problème est survenu', 'Essayez à nouveau.');
      this.setState({ isLoading: false });
      this.props.dispatch({ type: 'BACK' })
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={{ marginLeft: 10, marginRight: 10 }}>
            <TextInput
              autoFocus
              style={styles.input}
              value={this.state.name}
              placeholder="Nom"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => { this.refs._addressField.focus() }}
              onChangeText={name => this.setState({name})}
            />
            <TextInput
              ref={(c) => { this.refs._addressField = c }}
              style={styles.input}
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
              style={styles.inputMultiline}
              value={this.state.description}
              onChangeText={description => this.setState({description})}
              placeholder={`Description (facultatif)`}
              numberOfLines={3}
              onSubmitEditing={() => {this.createIssue(); }}
              returnKeyType="done"
            />
            <Text style={{ marginTop: 15 }}></Text>
            <Button
              color={this.state.isLoading ? '#31A69A': '#178c80'}
              disabled={!isValid(this.state) ||  this.state.isLoading}
              onPress={() => {this.createIssue(); }}
              title={this.state.isLoading ? "Envoi en cours..." : "Envoyer"}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20
  },
  input: {
    height: 40,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        borderColor: '#178c80',
        borderWidth: 0.5,
      },
    }),
  },
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
  state => ({ position: state.location.location }),
)(CreateModal);
