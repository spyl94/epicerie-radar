/* @flow */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';
import NavBar from './NavBar';

const logo = require('../android/app/src/main/res/playstore-icon.png');

export default class FirstScreen extends Component {

  render(): React.Element<any> {
    return (
        <View style={styles.loadingScreen}>
          <Image style={styles.logo} source={logo} />
          <Text style={{ marginTop: 15 }}>
            Récupération de votre position...
          </Text>
        </View>
    );
  }
};

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
 },
});
