// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  Animated,
  View
} from 'react-native';

class LaunchScreen extends Component {
  static navigationOptions = {
    header: { visible: false }
  };

  componentWillMount() {
    this._spin = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this._spin, { toValue: 1, duration: 6000 }).start();
  }

  render() {
    // Second interpolate beginning and end values (in this case 0 and 1)
    const spin = this._spin.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    return (
        <View style={styles.container}>
          <View style={styles.loadingScreen}>
            <Animated.Image
              style={[styles.logo, { transform: [{rotate: spin}] }]}
              source={require('../../img/logo.png')}
            />
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
