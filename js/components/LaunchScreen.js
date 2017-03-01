// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { startShowMapScreenTimer } from '../redux/modules/application';
import { loadUpToDateMarkers } from '../redux/modules/epicerie';
import { getAndSetCurrentLocation } from '../redux/modules/location';
import {
  StyleSheet,
  Text,
  Animated,
  PermissionsAndroid,
  Platform,
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
    const { dispatch } = this.props;
    startShowMapScreenTimer(dispatch);
    loadUpToDateMarkers(dispatch);
    // First set up animation
    Animated.timing(this._spin, { toValue: 1, duration: 6000 }).start();
    if (Platform.OS === 'android') {
      PermissionsAndroid
        .request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(() => {
          getAndSetCurrentLocation(dispatch);
        });
    } else {
      getAndSetCurrentLocation(dispatch);
    }
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
