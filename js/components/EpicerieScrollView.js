// @flow
import React, { Component, PureComponent } from 'react';
import { Platform, Dimensions, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { select } from '../redux/modules/epicerie';
import { updateRegion } from '../redux/modules/location';
import Epicerie from './Epicerie';
import Carousel from 'react-native-snap-carousel';

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = width - 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
});

const renderItem = ({item}) => {
    return (
      <View style={styles.card}>
        <Epicerie epicerie={item} />
      </View>
    );
}

class EpicerieScrollView extends Component {

  componentDidUpdate(prevProps) {
    if (prevProps.currentSelected != this.props.currentSelected && this._carousel) {
      this._carousel.snapToItem(this.props.currentSelected);
    }
  }

  render() {
    const { ready, currentSelected, dispatch, markers } = this.props;
    if (!ready) {
      return null;
    }
    return (
<View style={styles.scrollView}>
  <Carousel
  data={markers}
  renderItem={renderItem}
  sliderWidth={width}
  itemWidth={CARD_WIDTH}
  ref={(c) => { this._carousel = c; }}
  // hasParallaxImages={true}
  firstItem={currentSelected}
  inactiveSlideScale={0.94}
  inactiveSlideOpacity={1}
  // enableMomentum={false}
  scrollEndDragDebounceValue={Platform.OS === 'ios' ? 0 : 100}
  onSnapToItem={(index) => {
    dispatch(select(index));
    const { coords } = markers[index];
    dispatch(updateRegion(coords));
  }}
/>
</View>
    );
  }
}

export default connect(state => ({
  markers: Object.values(state.epicerie.markers),
  currentSelected: state.epicerie.currentSelected,
  ready: state.location.ready,
}))(EpicerieScrollView);
