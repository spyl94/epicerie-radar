import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import { reduxForm, change } from 'redux-form';
import Fetcher from '../services/Fetcher';
import DateTimePicker from 'react-native-modal-datetime-picker';
import PickOpeningHoursRow from './PickOpeningHoursRow';
import { hideDateTimePicker } from '../redux/modules/epicerie';

type Props = {
  epicerie: Object,
}

const validate = () => {
  const errors = {};
  return errors;
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

const onSubmit = (values, dispatch, { epicerie }) => {
  const { hours } = values;
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
  return Fetcher
  .post('/issues', body)
  .then(() => {
    Alert.alert(
      'Merci pour votre aide !',
      'Nous traitons votre message aussi vite que possible !'
    );
    dispatch({type: 'BACK'});
  })
  .catch(() => {
    Alert.alert(
      'Un problème est survenu',
      'Essayez à nouveau.'
    );
    dispatch({type: 'BACK'});
  });
}

class EditModalForm extends Component<{}, Props> {

        render() {
          const {
            dispatch,
            invalid,
            loading,
            handleSubmit,
            isDateTimePickerVisible,
            currentFocus,
            pristine
          } = this.props;
          const disabled = pristine || invalid ||  loading;
          return (
            <View style={styles.container}>
              <View>
                {
                  days.map((day) => <PickOpeningHoursRow day={day} />)
                }
                <DateTimePicker
                  mode="time"
                  isVisible={isDateTimePickerVisible}
                  onConfirm={(date: Date) => {
                    dispatch(change('update-horaires', 'hours.'+ currentFocus, moment(date).format('HH:MM')));
                    dispatch(hideDateTimePicker());
                  }}
                  onCancel={() => {
                    dispatch(hideDateTimePicker());
                  }}
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <Button
                  color={disabled ? '#31A69A': '#178c80'}
                  disabled={disabled}
                  onPress={handleSubmit(onSubmit)}
                  title={loading ? "Envoi en cours..." : "Envoyer"}
                />
              </View>
            </View>
          );
    }
}

const styles = StyleSheet.create({
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

const mapStateToProps = (state: Object) => {
  const epicerie = state.epicerie.currentSelected && state.epicerie.markers[state.epicerie.currentSelected];
  if (!epicerie) return {};
  return {
    epicerie,
    currentFocus: state.epicerie.focus,
    isDateTimePickerVisible: state.epicerie.isDateTimePickerVisible,
    initialValues: {
      daysOpen: {
        mon: !!(epicerie.hours && (epicerie.hours.mon_close !== null || epicerie.hours.mon_open !== null)),
        thu: !!(epicerie.hours && (epicerie.hours.thu_close !== null || epicerie.hours.thu_open !== null)),
        tue: !!(epicerie.hours && (epicerie.hours.tue_close !== null || epicerie.hours.tue_open !== null)),
        wed: !!(epicerie.hours && (epicerie.hours.wed_close !== null || epicerie.hours.wed_open !== null)),
        fri: !!(epicerie.hours && (epicerie.hours.fri_close !== null || epicerie.hours.fri_open !== null)),
        sat: !!(epicerie.hours && (epicerie.hours.sat_close !== null || epicerie.hours.sat_open !== null)),
        sun: !!(epicerie.hours && (epicerie.hours.sun_close !== null || epicerie.hours.sun_open !== null)),
      },
      hours: epicerie.hours,
    },
  };
};

export default connect(mapStateToProps)(
  reduxForm({
    form: 'update-horaires',
    validate,
    onSubmit,
  }
)(EditModalForm));
