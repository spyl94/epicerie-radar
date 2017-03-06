// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  Animated,
  Easing,
  View
} from 'react-native';

class LaunchScreen extends Component {
  static navigationOptions = {
    header: { visible: false }
  };

  constructor(props) {
    super(props);
    this._spin = new Animated.Value(0);
  }

  rotateImage() {
    this._spin.setValue(0);
    Animated.timing(this._spin, { toValue: 1, duration: 2000, easing: Easing.linear }).start(() => {
      this.rotateImage();
    });
  }

  componentDidMount() {
    this.rotateImage();
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
            <Text style={{ fontSize: 24, color: 'black', fontWeight: '500', marginBottom: 15 }}>
              Epicerie Radar
            </Text>
            <Animated.Image
              style={[styles.logo, { transform: [{rotate: spin}] }]}
              source={require('../../img/logo.png')}
            />
            <Text style={{ fontSize: 18, marginTop: 15 }}>
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
