// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Image } from 'react-native';
import Map from './Map';
import LocationInfo from './LocationInfo';
import EpicerieScrollView from './EpicerieScrollView';
import { navigateToCreateModal } from '../redux/modules/nav';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const logo = require('../../android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png');

class MapScreen extends Component {
  static navigationOptions = {
    title: 'Epicerie Radar',
    header: ({ dispatch }) => ({
      left: <Image style={[styles.image, { marginLeft: 10 }]} source={logo} />,
      right: (
        <View style={{flexDirection: 'row'}}>
          {/* <MaterialIcon
            onPress={() => {
              dispatch(navigateToEditModal());
            }}
            name="edit"
            size={24}
            color="#178c80"
            style={{ marginRight: 10 }}
          /> */}
          <MaterialIcon
            onPress={() => {
              dispatch(navigateToCreateModal());
            }}
            name="add"
            size={24}
            color="#178c80"
            style={{ marginRight: 10 }}
          />
        </View>
      ),
    }),
  };

  render() {
    return (
      <View style={styles.container}>
        <LocationInfo />
        <Map />
        <EpicerieScrollView />
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
    resizeMode: 'contain',
  },
  title: {
    flex: 1,
    color: '#rgba(0, 0, 0, 0.65)',
  },
});

export default connect()(MapScreen);
