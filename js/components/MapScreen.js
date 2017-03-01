// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import Map from './Map';
import LocationInfo from './LocationInfo';
import InformationModal from './InformationModal';
import SelectedEpicerie from './SelectedEpicerie';
import { showModal } from '../redux/modules/application';

const plus = require('../../img/plus.png');
const logo = require('../../android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png');

class MapScreen extends Component {
  static navigationOptions = {
    title: 'Epicerie Radar',
    header: ({ dispatch }) => ({
      left: (<Image
        style={[styles.image, {marginLeft: 10}]}
        source={logo}
             />),
      right: (
        <TouchableHighlight onPress={() => { dispatch(showModal()) }}>
          <Image
            style={[styles.image, {marginRight: 10}]}
            source={plus}
          />
        </TouchableHighlight>
      ),
    }),
  };

  render() {
    const { locationEnabled } = this.props;
    return (
      <View style={styles.container}>
        <LocationInfo enabled={locationEnabled} />
        <Map />
        <SelectedEpicerie />
        <InformationModal />
      </View>
    );
  }
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#F5FCFF',
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

export default connect(
  state => ({
    locationEnabled: state.location.enabled,
  })
)(MapScreen);
