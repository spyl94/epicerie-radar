/* @flow */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { openingStatus, getMarkerImage } from '../redux/modules/epicerie';
const styles = StyleSheet.create({
  selectedEpicerie: {
     margin: 0,
     height: 100,
     paddingTop: 15,
     paddingLeft: 15,
  },
});

export default class SelectedEpicerie extends Component {

  render(): React.Element<any> {
    const { epicerie } = this.props;
    const status = openingStatus(epicerie);
    return (
        <View style={styles.selectedEpicerie}>
          <Text style={{ fontWeight: 'bold' }}>
            {epicerie.name}
          </Text>
          <Text>
            {epicerie.address}
          </Text>
          <Text style={{ paddingTop: 10, color: status.color }}>
            {/* <Image style={{ margin: -10 }} source={getMarkerImage(status.type, true)} /> */}
            {
              status.text
            }
          </Text>
        </View>
      );
    }
}
