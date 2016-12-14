/* @flow */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  epicerie: {
     margin: 0,
     flex: 0.1,
     paddingTop: 15,
     paddingLeft: 15
  },
});

export default class SelectedEpicerie extends Component {

  render() {
    const { epicerie } = this.props;
    return (
        <View style={styles.epicerie}>
          <Text style={{ fontWeight: 'bold' }}>
            {epicerie.name}
          </Text>
          <Text>
            {epicerie.address}
          </Text>
          <Text style={{ marginTop: 20 }}>
            Les horaires seront bientôt disponible!
          </Text>
        </View>
      );
    }
}
