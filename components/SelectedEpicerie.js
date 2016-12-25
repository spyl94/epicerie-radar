/* @flow */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import moment from 'moment';

const styles = StyleSheet.create({
  selectedEpicerie: {
     margin: 0,
     height: 100,
     paddingTop: 15,
     paddingLeft: 15,
  },
});

const openingStatus = epicerie => {
  const date = moment();
  const currentHour = date.hours();
  let checkingHoursOfPrevDay = false;
  if (currentHour < 6) {
    date.subtract(1, 'day');
    checkingHoursOfPrevDay = true;
  }
  const currentDay = date.format('dddd').slice(0, 3).toLowerCase();
  if (!epicerie.hours || !epicerie.hours[currentDay + '_close']) {
    return {
      color: undefined,
      text: "Horaire non disponible..."
    };
  }
  const closingHour = parseInt(epicerie.hours[currentDay + '_close'].slice(0, 2), 10);
  if (
       (checkingHoursOfPrevDay && currentHour > closingHour)
    || (!checkingHoursOfPrevDay && currentHour < closingHour)
  ) {
    return {
      color: '#fa3e3e',
      text: 'Actuellement fermé',
    };
  }
  return {
    color: '#42b72a',
    text: "Ouvert jusqu'à " + epicerie.hours[currentDay + '_close']
  };
}

export default class SelectedEpicerie extends Component {

  render(): React.Element<any> {
    const { epicerie } = this.props;
    return (
        <View style={styles.selectedEpicerie}>
          <Text style={{ fontWeight: 'bold' }}>
            {epicerie.name}
          </Text>
          <Text>
            {epicerie.address}
          </Text>
          <Text style={{ paddingTop: 10, color: openingStatus(epicerie).color }}>
            {
              openingStatus(epicerie).text
            }
          </Text>
        </View>
      );
    }
}
