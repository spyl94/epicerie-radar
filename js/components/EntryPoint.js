// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import AppNavigator from './AppNavigator';
import { startShowMapScreenTimer } from '../redux/modules/application';
import { loadUpToDateMarkers } from '../redux/modules/epicerie';
import { getAndSetCurrentLocation } from '../redux/modules/location';
import {
  PermissionsAndroid,
  Platform,
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
  }

    render() {
        const { dispatch, nav } = this.props;
        return (
          <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
        );
    }
}

export default connect(state => ({ nav: state.nav }))(EntryPoint);
