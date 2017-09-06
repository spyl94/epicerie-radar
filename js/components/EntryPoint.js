// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';
import { addNavigationHelpers } from 'react-navigation';
import AppNavigator from './AppNavigator';
import { startShowMapScreenTimer } from '../redux/modules/nav';
import { loadUpToDateMarkers } from '../redux/modules/epicerie';
import { getAndSetCurrentLocation, locationError } from '../redux/modules/location';
import { Platform, BackHandler } from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Permissions from "react-native-permissions";

const checkLocationIsEnabled = async () => {
  if (Platform.OS === "android") {
    const checkLocation = await LocationServicesDialogBox.checkLocationServicesIsEnabled(
      {
        message:
          "<h2>Activer la géolocalisation ?</h2>Epicerie Radar souhaite utiliser le service de géolocalisation.<br/><br/>Ouvrir les paramètres pour activer la géolocalisation ?<br/><br/>",
        ok: "OUI",
        cancel: "NON",
        enableHighAccuracy: true,
        showDialog: true
      }
    ).catch(error => error);
    return checkLocation.enabled;
  } else {
    const checkLocation = await Permissions.check("location");
    if (checkLocation === "denied" && Permissions.canOpenSettings()) {
      Permissions.openSettings();
    }

    return checkLocation === "undetermined"
      ? true
      : checkLocation === "authorized"
  }
};

class EntryPoint extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    startShowMapScreenTimer(dispatch);
    loadUpToDateMarkers(dispatch);
    checkLocationIsEnabled().then(enabled => {
        if (enabled) {
          getAndSetCurrentLocation(dispatch);
        } else {
          locationError(dispatch);
        }
      });
    BackHandler.addEventListener('backPress', () => dispatch({ type: 'BACK' }));
  }

  render() {
    const { dispatch, nav } = this.props;
    // let tracker = new GoogleAnalyticsTracker('UA-87371140-1');
    // +      tracker.setTrackUncaughtExceptions(true);
    return (
      <AppNavigator
        navigation={addNavigationHelpers({ dispatch, state: nav })}
      />
    );
  }
}

export default connect(state => ({ nav: state.nav }))(EntryPoint);
