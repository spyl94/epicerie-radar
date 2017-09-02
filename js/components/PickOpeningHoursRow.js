import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { formValueSelector, Field } from 'redux-form';
import Switch from './Switch';
import DatePicker from './DatePicker';

class PickOpeningHoursRow extends Component<{}, {}> {
  render() {
    const { day: { day, code }, isOpen, style } = this.props;
    return (
      <View key={code} style={style}>
        <View style={{ flex: 0.3, flexDirection: 'row' }}>
          <Field
            confirmBtnText="Valider"
            cancelBtnText="Annuler"
            minuteInterval={10}
            name={`daysOpen.${code}`}
            component={Switch}
            style={{ height: 26, marginTop: -4 }}
          />
          <Text style={{ height: 26 }}>
            {day}
          </Text>
        </View>
        {isOpen &&
          <View
            style={{
              flex: 0.6,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{ height: 26, width: 50, textAlign: 'center' }}>
              {'de'}
            </Text>
            <Field
              name={`hours.${code}_open`}
              component={DatePicker}
              placeholder="Heure"
              style={{ width: 50, marginTop: -10, height: 40 }}
            />
            <Text style={{ height: 26, width: 50, textAlign: 'center' }}>
              {' à '}
            </Text>
            <Field
              name={`hours.${code}_close`}
              component={DatePicker}
              placeholder="Heure"
              style={{ width: 50, marginTop: -10, height: 40 }}
            />
          </View>}
      </View>
    );
  }
}

const mapStateToProps = (state: Object, props) => ({
  isOpen: formValueSelector(props.form)(state, 'daysOpen')[props.day.code],
});

export default connect(mapStateToProps)(PickOpeningHoursRow);
