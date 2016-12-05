/* @flow */
import React, { Component } from 'react';
import NavBar, { NavTitle, NavGroup, NavButton } from 'react-native-nav';
import { Image, StyleSheet } from 'react-native';

const logo = require('../android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png');
const styles = StyleSheet.create({
 statusBar: {
    backgroundColor: '#3343BD',
 },
 navBar: {
   backgroundColor: '#fff',
 },
 navButton: {
   flex: 1,
 },
 image: {
   width: 30,
   height: 25,
 },
 title: {
   flex: 1,
   color: '#rgba(0, 0, 0, 0.65)',
 },
});

export default class Nav extends Component {
  render() {
    return (
        <NavBar style={styles}>
          <NavButton style={styles.navButton}>
            <Image
              style={styles.image}
              resizeMode={"contain"}
              source={logo}
            />
          </NavButton>
          <NavTitle style={styles.title}>
            { "Epicerie Radar" }
          </NavTitle>
          <NavButton style={styles.navButton} />
        </NavBar>
    );
  }
};
