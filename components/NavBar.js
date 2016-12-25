/* @flow */
import React, { Component } from 'react';
import NavBar, { NavTitle, NavButton } from 'react-native-nav';
import { Image, StyleSheet } from 'react-native';
import { showModal } from '../redux/modules/application';
import { connect } from 'react-redux';

const plus = require('../img/plus.png');
const logo = require('../android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png');
const styles = StyleSheet.create({
 statusBar: {
    zIndex: 9999,
    backgroundColor: '#fff',
 },
 navBar: {
   margin: 0,
   padding: 0,
   backgroundColor: '#fff',
 },
 navButton: {
   flex: 1,
 },
 image: {
   flex: 1,
   width: 30,
   height: 30,
   resizeMode: 'contain'
 },
 title: {
   flex: 1,
   color: '#rgba(0, 0, 0, 0.65)',
 },
});

class Nav extends Component {
  render(): React.Element<any> {
    return (
        <NavBar style={styles}>
          <NavButton style={styles.navButton}>
            <Image
              style={styles.image}
              source={logo}
            />
          </NavButton>
          <NavTitle style={styles.title}>
            { "Epicerie Radar" }
          </NavTitle>
          <NavButton onPress={() => { this.props.showModal(); }} style={styles.navButton}>
            <Image
              style={[styles.image, {marginRight: 10}]}
              source={plus}
            />
          </NavButton>
        </NavBar>
    );
  }
}

export default connect(undefined, ({ showModal }))(Nav);
