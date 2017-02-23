// @flow
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
} from 'react-native';
import { connect } from 'react-redux';
import { reportNotExisting } from '../redux/modules/epicerie'

const styles = StyleSheet.create({
  selectedEpicerie: {
     margin: 0,
     height: 120,
     padding: 10,
  },
});

class SelectedEpicerie extends Component {

  render(): React.Element<any> {
    const { isReporting, epicerie, dispatch } = this.props;
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
          <Button
            onPress={() => {
              Alert.alert(
                'Signaler une fermeture définitive',
                'Confirmez vous que cette épicerie n\'existe pas ?',
                [
                { text: 'Annuler', onPress: () => {}, style: 'cancel'},
                { text: 'Oui', onPress: () => reportNotExisting(dispatch, epicerie)},
                ],
                { cancelable: true }
              )
            }}
            title={isReporting ? 'Signalement en cours...' : 'Signaler fermeture définitive'}
            color={isReporting ? '#31A69A': '#178c80'}
            style={{ marginTop: 10 }}
          />

        </View>
      );
    }
}

export default connect(
  state => ({
    epicerie: state.epicerie.markers[state.epicerie.currentSelected],
    isReporting: state.epicerie.isReporting,
  })
)(SelectedEpicerie);