/* @flow */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
const styles = StyleSheet.create({
  selectedEpicerie: {
     margin: 0,
     height: 100,
     paddingTop: 15,
     paddingLeft: 15,
  },
});

class SelectedEpicerie extends Component {

  render(): React.Element<any> {
    const { epicerie } = this.props;
    if (!epicerie) {
      return <View />;
    }
    return (
        <View style={styles.selectedEpicerie}>
          <Text style={{ fontWeight: 'bold' }}>
            {epicerie.name}
          </Text>
          <Text>
            {epicerie.address}
          </Text>
          <Text style={{ paddingTop: 10, color: epicerie.color }}>
            {
              epicerie.text
            }
          </Text>
        </View>
      );
    }
}

export default connect(
  state => ({
    epicerie: state.epicerie.markers[state.epicerie.currentSelected],
  })
)(SelectedEpicerie);
