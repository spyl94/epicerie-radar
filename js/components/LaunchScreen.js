// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, StyleSheet, Text, Animated, Easing, View } from 'react-native';
import Animation from 'lottie-react-native';

class LaunchScreen extends Component {
  static navigationOptions = {
    header: { visible: false },
  };

  constructor(props) {
    super(props);
    this._spin = new Animated.Value(0);
  }

  rotateImage() {
    this._spin.setValue(0);
    Animated.timing(this._spin, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
    }).start(() => {
      this.rotateImage();
    });
  }

  componentDidMount() {
    this.rotateImage();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.loadingScreen}>
          {/* <Text
            style={{
              fontSize: 24,
              color: 'black',
              fontWeight: '500',
              marginBottom: 25,
            }}>
            Epicerie Radar
          </Text> */}
          <Image
            style={styles.logo}
            source={require('../../play-store-icon.png')}
          />
          <Animation
  style={{
    width: 200,
    height: 200,
    marginTop: 50,
  }}
  source={require('../animations/pin.json')}
  progress={this._spin}
/>
{/* <Text style={{ fontSize: 18, fontWeight: '200' }}>
  Récupération des épiceries...
</Text> */}
        </View>
      </View>
    );
  }
}

export default connect()(LaunchScreen);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingScreen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});
