import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  TextInput,
  View,
  Button,
  Alert,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Fetcher from '../services/Fetcher';
// import { Field, reduxForm } from 'redux-form';
import DateTimePicker from 'react-native-modal-datetime-picker';

type Props = {
  epicerie: Object,
}

const days = [
  { day: "Lundi", code: 'mon' },
  { day: "Mardi", code: 'thu' },
  { day: "Mercredi", code: 'tue' },
  { day: "Jeudi", code: 'wed' },
  { day: "Vendredi", code: 'fri' },
  { day: "Samedi", code: 'sat' },
  { day: "Dimanche", code: 'sun' },
]

class EditModal extends Component<{}, Props> {
  static navigationOptions = {
    header: {
      title: 'Modifier les horaires',
    },
  };
  state = {
    description: null,
    isLoading: false,
    hours: {
      fri_close : null,
      mon_close : null,
      sat_close : null,
      sun_close : null,
      thu_close : null,
      tue_close : null,
      wed_close : null,
      fri_open : null,
      mon_open : null,
      sat_open : null,
      sun_open : null,
      thu_open : null,
      tue_open : null,
      wed_open : null,
    },
    focus: null,
    isDateTimePickerVisible: false,
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  createIssue = () => {
    const { epicerie } = this.props;
    this.setState({ isLoading: true });
    const body = {
      title: 'Un utilisateur vient de modifier les horaires.',
      body: `Epicerie à modifier: ${JSON.stringify(epicerie)} => ${this.state.description}`,
    };
    Fetcher
    .post('/issues', body)
    .then(() => {
      Alert.alert('Merci pour votre aide!', 'Nous traitons votre message aussi vite que possible!');
      this.setState({ description: null, isLoading: false });
      this.props.dispatch({type: 'BACK'});
    })
    .catch(() => {
      Alert.alert('Un problème est survenu', 'Essayez à nouveau.');
      this.setState({ isLoading: false });
      this.props.dispatch({type: 'BACK'});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View>
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
            <DateTimePicker
              mode="time"
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={(date) => {
                this._hideDateTimePicker();
                this.setState({ hours: { ...this.state.hours, [this.state.focus]: date }});
              }}
              onCancel={this._hideDateTimePicker}
            />
            {
              days.map(({day, code}) => (
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                  <Text>{day}</Text>
                  <Text
                    style={styles.textinput}
                    onPress={() => {
                      this.setState({ focus: code +'_open'});
                      this._showDateTimePicker();
                    }}
                  >
                    {
                      !this.state.time ? 'Heure' : moment(this.state.hours[code +'_open']).format('HH:MM')
                    }
                  </Text>
                  <Text>-</Text>
                  <Text
                    style={styles.textinput}
                    onPress={() => {
                      this.setState({ focus: code+'_close'});
                      this._showDateTimePicker();
                    }}
                  >
                    {
                      !this.state.time ? 'Heure' : moment(this.state.hours[code + '_close']).format('HH:MM')
                    }
                  </Text>
                </View>
              ))
            }
            <Button
              color={this.state.isLoading ? '#31A69A': '#178c80'}
              style={{ marginTop: 20 }}
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
  textinput: {
    height: 26,
    width: 50,
    marginTop: -5,
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    padding: 4,
    fontSize: 13,
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
  state => ({
    epicerie: state.epicerie.currentSelected && state.epicerie.markers[state.epicerie.currentSelected],
  }),
)(EditModal);
