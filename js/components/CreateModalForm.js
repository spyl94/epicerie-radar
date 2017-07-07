import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  Text,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { formValueSelector, Field, reduxForm } from 'redux-form';
import Input from './Input';
import Fetcher from '../services/Fetcher';
import PickOpeningHoursRow from './PickOpeningHoursRow';
import RadioButton from './RadioButton';
import { Form } from 'native-base';
import type { Marker, Dispatch } from '../types';

type Props = {
  position: Object,
}
type RequiredFormValues = {
  name: String,
  address: String,
}

const validate = (values: RequiredFormValues) => {
  const errors = {};
  if (!values.name || values.name.length < 2) {
      errors.name = 'Required';
  }
  if (!values.address || values.address.length < 2) {
      errors.address = 'Required';
  }
  return errors;
}

const onSubmit = ({ name, address, description, hours, horairesAreKnown }: Marker, dispatch: Dispatch, { position }) => {
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
horairesAreKnown,
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
  focusNextField = (nextField: string) => {
    const intance = this.refs[nextField].getRenderedComponent();
    intance.focus();
  };

  render() {
    const { form, horairesAreKnown, invalid, submitting, handleSubmit } = this.props;
    const disabled = invalid || submitting;
    return (
          <Form>
            <Field
              ref="2"
              withRef
              autoFocus
              component={Input}
              label={'Nom'}
              name="name"
              highlightColor={'#00BCD4'}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.focusNextField('2')}
            />
            <Field
              ref="2"
              withRef
              component={Input}
              name="address"
              label="Adresse"
              highlightColor={'#00BCD4'}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.focusNextField('3')}
            />
            <Field
              ref="3"
              withRef
              multiline
              component={Input}
              name="description"
              label={`Description (facultatif)`}
              numberOfLines={3}
              highlightColor={'#00BCD4'}
              // onSubmitEditing={handleSubmit(onSubmit)}
              returnKeyType="done"
            />
            <Text style={{ marginTop: 15 }}></Text>
            <Field
              name="horairesAreKnown"
              options={['Horaires connus', 'Horaires inconnus']}
              component={RadioButton}
            />
            <Text style={{ marginTop: 15 }}></Text>
            {
              horairesAreKnown === 'Horaires connus' &&
              days.map((day, index) => (
                <PickOpeningHoursRow
                  style={{flex: 1, flexDirection: 'row', marginBottom: 30 }}
                  form={form}
                  day={day}
                  key={index}
                />
              ))
            }
            <Text style={{ marginTop: 20 }}></Text>
            {
                submitting
                  ? <ActivityIndicator />
              : <Button
                color={disabled ? '#31A69A': '#178c80'}
                disabled={disabled}
                onPress={!disabled ? handleSubmit(onSubmit) : () => {}}
                title="Envoyer"
                />
            }
          </Form>
    );
  }
}

const connector = connect((state: State) => ({
  position: state.location.location,
  horairesAreKnown : formValueSelector('create')(state, 'horairesAreKnown'),
  initialValues: {
    hours: {},
    horairesAreKnown: 'Horaires inconnus',
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
