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
import { navigateToEditModal } from '../redux/modules/nav';

const styles = StyleSheet.create({
  container: {
     margin: 0,
     flex: 0.35,
     padding: 10,
  },
});

class SelectedEpicerie extends Component {

  render() {
    const { isReporting, epicerie, dispatch } = this.props;
    if (!epicerie) {
      return null;
    }
    return (
        <View style={styles.container}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            {epicerie.name}
          </Text>
          <Text style={{ fontSize: 16 }}>
            {epicerie.address}
          </Text>
          <Text style={{ fontSize: 16, color: epicerie.color }}>
            {
                epicerie.text
            }
          </Text>
          <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <Text>{ ' ' }</Text>
            <Button
              onPress={() => { dispatch(navigateToEditModal())} }
              color={'#178c80'}
              title="Modifier les horaires"
            />
            <Text>{' '}</Text>
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
            />
            <Text style={{ minHeight: 10, marginBottom: 10 }}>{ ' ' }</Text>
          </View>
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
