import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Button,
  Alert,
  Text,
  Switch,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
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
      title: 'Modifier les horaires d\'ouverture',
    },
  };

  constructor(props) {
    super(props);
    const { epicerie } = props;
    this.state = {
      description: null,
      isLoading: false,
      daysOpen: {
        mon: epicerie && epicerie.hours && (epicerie.hours.mon_close !== null || epicerie.hours.mon_open !== null),
        thu: epicerie && epicerie.hours && (epicerie.hours.thu_close !== null || epicerie.hours.thu_open !== null),
        tue: epicerie && epicerie.hours && (epicerie.hours.tue_close !== null || epicerie.hours.tue_open !== null),
        wed: epicerie && epicerie.hours && (epicerie.hours.wed_close !== null || epicerie.hours.wed_open !== null),
        fri: epicerie && epicerie.hours && (epicerie.hours.fri_close !== null || epicerie.hours.fri_open !== null),
        sat: epicerie && epicerie.hours && (epicerie.hours.sat_close !== null || epicerie.hours.sat_open !== null),
        sun: epicerie && epicerie.hours && (epicerie.hours.sun_close !== null || epicerie.hours.sun_open !== null),
      },
      hours: epicerie ? epicerie.hours : {},
      focus: null,
      isDateTimePickerVisible: false,
    };
  }


  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  createIssue = () => {
    const { epicerie, dispatch } = this.props;
    const { hours } = this.state;
    this.setState({ isLoading: true });
    const body = {
      title: 'Un utilisateur vient de modifier les horaires.',
      body: `**Epicerie à modifier**
\`\`\`json
${JSON.stringify(epicerie, undefined, 2)}
\`\`\`
**Nouveaux horaires**
\`\`\`json
${JSON.stringify(hours, undefined, 2)}
\`\`\`
`
    };
    Fetcher
    .post('/issues', body)
    .then(() => {
      Alert.alert(
        'Merci pour votre aide !',
        'Nous traitons votre message aussi vite que possible !'
      );
      this.setState({ isLoading: false });
      dispatch({type: 'BACK'});
    })
    .catch(() => {
      Alert.alert(
        'Un problème est survenu',
        'Essayez à nouveau.'
      );
      this.setState({ isLoading: false });
      dispatch({type: 'BACK'});
    });
  }

  render() {
    const {
      name,
      focus,
      isDateTimePickerVisible,
      hours,
      isLoading,
    } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <DateTimePicker
            mode="time"
            isVisible={isDateTimePickerVisible}
            onConfirm={(date: Date) => {
              this._hideDateTimePicker();
              this.setState({
                hours: {
                    ...hours,
                  [focus]: moment(date).format('HH:MM')
                }
              });
            }}
            onCancel={this._hideDateTimePicker}
          />
          {
            days.map(({day, code}) => (
              <View
                key={code}
                style={{flex: 1, flexDirection: 'row', marginBottom: 40 }}
              >
                <View style={{ flex: 0.4, flexDirection: 'row' }}>
                  <Switch
                    style={{ height: 26 }}
                    value={this.state.daysOpen[code]}
                    onValueChange={(value: boolean) => {
                      this.setState({
                        daysOpen: {
                          ...this.state.daysOpen, [code]: value,
                        },
                        hours: {
                          ...this.state.hours,
                          [code +'_open']: value ? '10:00' : null,
                          [code +'_close']: value ? '00:00' : null,
                        },
                      });
                    }}
                  />
                  <Text style={{ height: 26 }}>{day}</Text>
                </View>
                {
                  this.state.daysOpen[code] &&
                    <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ height: 26, width: 50, textAlign: 'center' }}>
                        {"de"}
                      </Text>
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
                          !hours[code +'_open']
                          ? 'Heure'
                          : hours[code +'_open']
                        }
                      </Text>
                      <Text style={{ height: 26, width: 50, textAlign: 'center' }}>{" à "}</Text>
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
                          !hours[code + '_close']
                          ? 'Heure'
                          : hours[code + '_close']
                        }
                      </Text>
                    </View>
                }
              </View>
            ))
          }
          <View style={{ marginTop: 20 }}>
            <Button
              color={isLoading ? '#31A69A': '#178c80'}
              disabled={name === null ||  isLoading}
              onPress={() => {
                this.createIssue();
              }}
              title={isLoading ? "Envoi en cours..." : "Envoyer"}
            />
          </View>
        </View>
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
});

export default connect(
  state => ({
    epicerie: state.epicerie.currentSelected && state.epicerie.markers[state.epicerie.currentSelected],
  }),
)(EditModal);
