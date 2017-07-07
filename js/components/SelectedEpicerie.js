// @flow
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  Animated,
  PanResponder,
} from 'react-native';
import { connect } from 'react-redux';
import { reportNotExisting } from '../redux/modules/epicerie'
import { navigateToEditModal } from '../redux/modules/nav';

const styles = StyleSheet.create({
  content: {
    // padding: 30,
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // flex: 0.3,
    // paddingHorizontal: 0
    flex: 0.3,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 400,
    flex: 1,
    // marginHorizontal: 40,
    marginVertical: 30,
  }
});

class SelectedEpicerie extends Component {
  state = {
    pan: new Animated.ValueXY(),
    expanded: false,
  };
  _panResponder = PanResponder.create({
         onMoveShouldSetResponderCapture: () => true,
         onMoveShouldSetPanResponderCapture: () => !this.state.expanded,

          // Initially, set the value of x and y to 0 (the center of the screen)
         onPanResponderGrant: () => {
           this.state.pan.setValue({x: 0, y: 0});
            //  if (!this.state.expanded) {
            //      this.state.pan.setOffset({
            //        x: this.state.pan.x._value,
            //        y:  this.state.pan.y._value
            //      });
            //  }
         },
         // When we drag/pan the object, set the delate to the states pan position
         onPanResponderMove: () => {
             if (this.state.expanded) {
                 return;
             }
             return Animated.event([ null, { dy: this.state.pan.y }]);
         },
         onPanResponderRelease: (e, gesture) => {
             if (gesture.moveY > 0 && gesture.moveY < 350) {
                 Animated.spring(this.state.pan,{
                   toValue: { x:0, y:-280 }
                 }).start(() => {
                    this.state.pan.flattenOffset();
                 });
                 this.setState({ expanded: true });
             } else {
                 Animated.spring(this.state.pan, {
                   toValue:{
                     x:0, y:0
                   }
                 }
                 ).start();
                 this.setState({
                     expanded: false
                 });
             }
         }
  });

  render() {
    const { isReporting, epicerie, dispatch } = this.props;
    if (!epicerie) {
      return null;
    }
    let { pan } = this.state;
    let [translateX, translateY] = [pan.x, pan.y];
    return (
      <View style={styles.content}>
        <Animated.View style={{
          transform: [{translateX}, {translateY}],
          marginBottom: -200
        }}
          {...this._panResponder.panHandlers}
        >
          <View style={styles.container} shadowColor={'#000'} shadowOffset={{width: 0, height: 10}} shadowOpacity={0.4} shadowRadius={20}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {epicerie.name}
            </Text>
            <Text style={{ fontSize: 16 }}>
              {epicerie.address}
            </Text>
            <Text style={{ fontSize: 16, color: epicerie.color }}>
              {
                epicerie.text
              }
            </Text>
            <View style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <Text>{ ' ' }</Text>
              <Button
                onPress={() => { dispatch(navigateToEditModal())} }
                color={'#178c80'}
                title="Modifier les horaires"
              />
              <Text>{ ' '}</Text>
              <Button
                onPress={() => {
                  Alert.alert(
                    'Signaler une fermeture définitive',
                    'Confirmez vous que cette épicerie n\'existe pas ?',
                    [
                    { text: 'Annuler', onPress: () => {}, style: 'cancel'},
                    { text: 'Oui', onPress: () => reportNotExisting(dispatch, epicerie)},
                    ],
                    { cancelable: true }
                  )
                }}
                title={isReporting ? 'Signalement en cours...' : 'Signaler fermeture définitive'}
                color={isReporting ? '#31A69A': '#178c80'}
              />
              <Text style={{ minHeight: 10, marginBottom: 10 }}>{ ' ' }</Text>
            </View>
          </View>
        </Animated.View>
      </View>
      );
    }
}

export default connect(
  state => ({
    epicerie: state.epicerie.markers[state.epicerie.currentSelected],
    isReporting: state.epicerie.isReporting,
  })
)(SelectedEpicerie);
