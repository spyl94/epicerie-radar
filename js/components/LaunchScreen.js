// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { startShowMapScreenTimer } from '../redux/modules/application';
import { loadUpToDateMarkers } from '../redux/modules/epicerie';
import {
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';
import NavBar from './NavBar';

class LaunchScreen extends Component {

  componentDidMount() {
    startShowMapScreenTimer(this.props.dispatch);
    loadUpToDateMarkers(this.props.dispatch);
  }

  render() {
    return (
        <View style={styles.container}>
          <NavBar />
          <View style={styles.loadingScreen}>
            <Image style={styles.logo} source={require('../img/logo.png')} />
            <Text style={{ marginTop: 15 }}>
              Récupération de votre position...
            </Text>
          </View>
        </View>
    );
  }
}

export default connect()(LaunchScreen)

const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
 },
 loadingScreen: {
   flex: 1,
   flexDirection: 'column',
   justifyContent: 'center',
   alignItems: 'center',
 },
 logo: {
   width: 150,
   height: 150,
   resizeMode: 'contain'
 },
});
