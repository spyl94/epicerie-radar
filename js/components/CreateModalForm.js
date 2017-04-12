import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  Button,
  Alert,
} from 'react-native';
import { change, Field, reduxForm } from 'redux-form';
import Input from './Input';
import Fetcher from '../services/Fetcher';
import { CreatePickOpeningHoursRow } from './PickOpeningHoursRow';
import { hideDateTimePicker } from '../redux/modules/epicerie';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

type Props = {
  position: Object,
}
const validate = (values: Object) => {
  const errors = {};
  if (!values.name || values.name.length < 2) {
      errors.name = 'Required';
  }
  if (!values.address || values.address.length < 2) {
      errors.address = 'Required';
  }
  return errors;
}

const onSubmit = ({ name, address, description, hours }: Object, dispatch, { position }) => {
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
hours,
}, undefined, 2)}
\`\`\`
**Position de l'utilisateur**
\n\n
\`${JSON.stringify(position, undefined, 2)}\` ([Streetview](http://maps.google.com/maps?q=&layer=c&cbll=${position.latitude},${position.longitude}&cbp=11,0,0,0,0))
`};
  return Fetcher
  .post('/issues', body)
  .then(() => {
    Alert.alert('Merci pour votre aide!', 'Nous traitons votre message et on ajoute les données à la prochaine mise à jour!');
    dispatch({ type: 'BACK' })
  })
  .catch(() => {
    Alert.alert('Un problème est survenu', 'Essayez à nouveau.');
    dispatch({ type: 'BACK' })
  });
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

class CreateModalForm extends Component<{}, Props> {

  render() {
    const { currentFocus, isDateTimePickerVisible, dispatch, invalid, submitting, handleSubmit } = this.props;
    const disabled = invalid || submitting;
    return (
          <View>
            <Field
              autoFocus
              component={Input}
              label={'Nom'}
              name="name"
              highlightColor={'#00BCD4'}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => { this.refs._addressField.focus() }}
            />
            <Field
              ref={(c) => { this.refs._addressField = c }}
              component={Input}
              name="address"
              label="Adresse"
              highlightColor={'#00BCD4'}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => { this.refs._descriptionField.focus() }}
            />
            <Field
              ref={(c) => { this.refs._descriptionField = c }}
              multiline
              component={Input}
              name="description"
              label={`Description (facultatif)`}
              numberOfLines={3}
              highlightColor={'#00BCD4'}
              onSubmitEditing={handleSubmit(onSubmit)}
              returnKeyType="done"
            />
            <Text style={{ marginBottom: 15, marginTop: 30 }}>Horaires d'ouverture (facultatif)</Text>
            {
              days.map((day) => <CreatePickOpeningHoursRow day={day} />)
            }
            <Text style={{ marginTop: 15 }}></Text>
            <DateTimePicker
              mode="time"
              isVisible={isDateTimePickerVisible}
              onConfirm={(date: Date) => {
                dispatch(change('create', 'hours.'+ currentFocus, moment(date).format('HH:MM')));
                dispatch(hideDateTimePicker());
              }}
              onCancel={() => {
                dispatch(hideDateTimePicker());
              }}
            />
            <Button
              color={disabled ? '#31A69A': '#178c80'}
              disabled={disabled}
              onPress={!disabled ? handleSubmit(onSubmit) : () => {}}
              title={submitting ? "Envoi en cours..." : "Envoyer"}
            />
          </View>
    );
  }
}

const connector = connect(state => ({
  position: state.location.location,
  currentFocus: state.epicerie.focus,
  isDateTimePickerVisible: state.epicerie.isDateTimePickerVisible,
  initialValues: {
    hours: {},
    daysOpen: {
      mon: false,
      thu: false,
      tue: false,
      wed: false,
      fri: false,
      sat: false,
      sun: false,
    },
  }
}));

export default connector(reduxForm({
  form: 'create',
  onSubmit,
  validate,
})(CreateModalForm));
