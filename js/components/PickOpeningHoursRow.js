import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { formValueSelector, Field } from 'redux-form';
import Switch from './Switch';
import { showTimePicker } from '../redux/modules/epicerie';

class PickOpeningHoursRow extends Component<{}, {}> {

        render() {
          const { day: { day, code }, isOpen, hours, dispatch } = this.props;
          return (
            <View
              key={code}
              style={{flex: 1, flexDirection: 'row', marginBottom: 40 }}
            >
              <View style={{ flex: 0.4, flexDirection: 'row' }}>
                <Field
                  name={`daysOpen.${code}`}
                  component={Switch}
                  style={{ height: 26, marginTop: -4 }}
                />
                <Text style={{ height: 26 }}>{day}</Text>
              </View>
              {
                isOpen &&
                  <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ height: 26, width: 50, textAlign: 'center' }}>
                      {"de"}
                    </Text>
                    <Text
                      style={styles.textinput}
                      onPress={() => { dispatch(showTimePicker(code + '_open')) }}
                    >
                      {
                        !hours.open
                        ? 'Heure'
                        : hours.open
                      }
                    </Text>
                    <Text style={{ height: 26, width: 50, textAlign: 'center' }}>{" à "}</Text>
                    <Text
                      style={styles.textinput}
                      onPress={() => { dispatch(showTimePicker(code + '_close')) }}
                    >
                      {
                        !hours.close
                        ? 'Heure'
                        : hours.close
                      }
                    </Text>
                  </View>
              }
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

const mapStateToPropsUpdate = (state: Object, props) => ({
    hours: {
      open: formValueSelector('update-horaires')(state, 'hours') ? formValueSelector('update-horaires')(state, 'hours')[props.day.code + '_open'] : null,
      close: formValueSelector('update-horaires')(state, 'hours') ? formValueSelector('update-horaires')(state, 'hours')[props.day.code + '_close']: null
    },
    isOpen: formValueSelector('update-horaires')(state, 'daysOpen')[props.day.code],
});

const mapStateToPropsCreate = (state: Object, props) => ({
    hours: {
      open: formValueSelector('create')(state, 'hours') ? formValueSelector('create')(state, 'hours')[props.day.code + '_open'] : null,
      close: formValueSelector('create')(state, 'hours') ? formValueSelector('create')(state, 'hours')[props.day.code + '_close']: null
    },
    isOpen: formValueSelector('create')(state, 'daysOpen')[props.day.code],
});

export const CreatePickOpeningHoursRow = connect(mapStateToPropsCreate)(PickOpeningHoursRow);
export default connect(mapStateToPropsUpdate)(PickOpeningHoursRow);
