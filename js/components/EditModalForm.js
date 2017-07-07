import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { reduxForm } from 'redux-form';
import Fetcher from '../services/Fetcher';
import PickOpeningHoursRow from './PickOpeningHoursRow';

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
            invalid,
            loading,
            submitting,
            handleSubmit,
            pristine,
            form
          } = this.props;
          const disabled = pristine || invalid ||  loading;
          return (
            <View>
              <View>
                {
                  days.map((day, index) => (
                    <PickOpeningHoursRow
                      style={{flex: 1, flexDirection: 'row', marginBottom: 50 }}
                      form={form}
                      day={day}
                      key={index}
                    />
                  ))
                }
              </View>
              <View style={{ marginTop: 20 }}>
                {
                  submitting
                    ? <ActivityIndicator />
                  :  <Button
                    color={disabled ? '#31A69A': '#178c80'}
                    disabled={disabled}
                    onPress={handleSubmit(onSubmit)}
                    title="Envoyer"
                     />
                }

              </View>
            </View>
          );
    }
}

const mapStateToProps = (state: Object) => {
  const epicerie = state.epicerie.currentSelected && state.epicerie.markers[state.epicerie.currentSelected];
  if (!epicerie) return {};
  const hours = epicerie.hours;
  return {
    epicerie,
    initialValues: {
      daysOpen: {
        mon: !!(hours && (hours.mon_close !== null || hours.mon_open !== null)),
        thu: !!(hours && (hours.thu_close !== null || hours.thu_open !== null)),
        tue: !!(hours && (hours.tue_close !== null || hours.tue_open !== null)),
        wed: !!(hours && (hours.wed_close !== null || hours.wed_open !== null)),
        fri: !!(hours && (hours.fri_close !== null || hours.fri_open !== null)),
        sat: !!(hours && (hours.sat_close !== null || hours.sat_open !== null)),
        sun: !!(hours && (hours.sun_close !== null || hours.sun_open !== null)),
      },
      hours: hours,
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
