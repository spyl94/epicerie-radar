import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  Text,
  TextInput,
  View,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Fetcher from '../services/Fetcher';

type Props = {
  position: Object,
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
            <Text style={{ marginTop: 10, marginLeft: 5, color: 'black', fontWeight: 'bold' }}>
              Horaires
            </Text>
            <TextInput
              ref={(c) => { this.refs._descriptionField = c }}
              multiline
              style={styles.inputMultiline}
              value={this.state.description}
              onChangeText={description => this.setState({description})}
              placeholder={`Exemple: Ouverte en semaine jusqu'à 2h, 5h le week-end`}
              numberOfLines={3}
              onSubmitEditing={() => {this.createIssue(); }}
              returnKeyType="done"
            />
            <Text style={{ marginTop: 15 }}></Text>
            <Button
              color={this.state.isLoading ? '#31A69A': '#178c80'}
              disabled={this.state.name === null ||  this.state.isLoading}
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
