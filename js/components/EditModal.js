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

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  createIssue = () => {
    const { epicerie } = this.props;
    this.setState({ isLoading: true });
    const hours = { ...this.state.hours };
    for (let hour in hours) {
      if (hours.hasOwnProperty(hour) && hours[hour]) {
        hours[hour] = moment(hours[hour]).format('HH:MM');
      }
    }
    const body = {
      title: 'Un utilisateur vient de modifier les horaires.',
      body: `Epicerie à modifier: ${JSON.stringify(epicerie)} => ${JSON.stringify(hours)}`,
    };
    Fetcher
    .post('/issues', body)
    .then(() => {
      Alert.alert('Merci pour votre aide!', 'Nous traitons votre message aussi vite que possible!');
      this.setState({ isLoading: false });
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
            <DateTimePicker
              mode="time"
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={(date) => {
                this._hideDateTimePicker();
                this.setState({
                  hours: {
                    ...this.state.hours,
                    [this.state.focus]: date
                  }
                });
              }}
              onCancel={this._hideDateTimePicker}
            />
            {
              days.map(({day, code}) => (
                <View key={code} style={{flex: 1, flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                  <Text style={{ flex: 0.5 }}>{day}</Text>
                  <View style={{ flex: 0.5, flexDirection: 'row' }}>
                    <Text
                      style={styles.textinput}
                      onPress={() => {
                        this.setState({
                          focus: code +'_open',
                          isDateTimePickerVisible: true
                        });
                      }}
                    >
                      {
                        !this.state.hours[code +'_open'] ? 'Heure' : moment(this.state.hours[code +'_open']).format('HH:MM')
                      }
                    </Text>
                    <Text>{' '}-{' '}</Text>
                    <Text
                      style={styles.textinput}
                      onPress={() => {
                        this.setState({
                          focus: code+'_close',
                          isDateTimePickerVisible: true
                        });
                      }}
                    >
                      {
                        !this.state.hours[code + '_close'] ? 'Heure' : moment(this.state.hours[code + '_close']).format('HH:MM')
                      }
                    </Text>
                  </View>
                </View>
              ))
            }
            <View style={{ marginTop: 20 }}>
              <Button
                color={this.state.isLoading ? '#31A69A': '#178c80'}
                disabled={this.state.name === null ||  this.state.isLoading}
                onPress={() => {this.createIssue(); }}
                title={this.state.isLoading ? "Envoi en cours..." : "Envoyer"}
              />
            </View>
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
