// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';
import { addNavigationHelpers } from 'react-navigation';
import AppNavigator from './AppNavigator';
import { startShowMapScreenTimer } from '../redux/modules/nav';
import { loadUpToDateMarkers } from '../redux/modules/epicerie';
import { getAndSetCurrentLocation } from '../redux/modules/location';
import {
  PermissionsAndroid,
  Platform,
  BackHandler,
} from 'react-native';

class EntryPoint extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    startShowMapScreenTimer(dispatch);
    loadUpToDateMarkers(dispatch);
    if (Platform.OS === 'android') {
      PermissionsAndroid
        .request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(() => {
          getAndSetCurrentLocation(dispatch);
        });
    } else {
      getAndSetCurrentLocation(dispatch);
    }
    BackHandler.addEventListener('backPress', () =>
        dispatch({type: 'BACK'})
    );
  }

    render() {
        const { dispatch, nav } = this.props;
        // let tracker = new GoogleAnalyticsTracker('UA-87371140-1');
 // +      tracker.setTrackUncaughtExceptions(true);
        return (
          <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
        );
    }
}

export default connect(state => ({ nav: state.nav }))(EntryPoint);
