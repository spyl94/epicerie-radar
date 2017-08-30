// @flow
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
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

class EpicerieScrollView extends Component {

  // componentWillMount() {
  //   this.animation = new Animated.Value(0);
  // }

  componentDidMount() {
  // We should detect when scrolling has stopped then animate
  // We should just debounce the event listener here
  // const { currentSelected, dispatch, markers } = this.props;
  // this.animation.addListener(({ value }) => {
  //   let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
  //   console.log({value, index });
  //   if (index >= markers.length) {
  //     index = markers.length - 1;
  //   }
  //   if (index <= 0) {
  //     index = 0;
  //   }
  //
  //   clearTimeout(this.regionTimeout);
  //   this.regionTimeout = setTimeout(() => {
  //     if (currentSelected !== index) {
  //       dispatch(select(index));
  //       const { coords } = markers[index];
  //       dispatch(updateRegion(coords));
  //     }
  //   }, 10);
  // });
}

  renderItem = ({item}) => {
    return (
      <View style={styles.card}>
        <Epicerie epicerie={item} />
      </View>
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentSelected != this.props.currentSelected) {
      this._carousel.snapToItem(this.props.currentSelected);
    }
  }

  render() {
    const { dispatch, markers } = this.props;
    return (
//       <Animated.ScrollView
//   horizontal
//   scrollEventThrottle={1}
//   showsHorizontalScrollIndicator={false}
//   snapToInterval={CARD_WIDTH}
//   onScrollEndDrag={
//
//   }
//   onScroll={Animated.event(
//     [
//       {
//         nativeEvent: {
//           contentOffset: {
//             x: this.animation,
//           },
//         },
//       },
//     ],
//     { useNativeDriver: true }
//   )}
//   style={styles.scrollView}
//   contentContainerStyle={styles.endPadding}
// >
<View style={styles.scrollView}>
  <Carousel
  data={markers}
  renderItem={this.renderItem}
  sliderWidth={width}
  itemWidth={CARD_WIDTH}
  ref={(c) => { this._carousel = c; }}
  // hasParallaxImages={true}
  // firstItem={SLIDER_1_FIRST_ITEM}
  // inactiveSlideScale={0.94}
  // inactiveSlideOpacity={0.6}
  // enableMomentum={false}
  // containerCustomStyle={styles.slider}
  // contentContainerCustomStyle={styles.sliderContentContainer}
  // scrollEndDragDebounceValue={Platform.OS === 'ios' ? 0 : 100}
  onSnapToItem={(index) => {
    dispatch(select(index));
    const { coords } = markers[index];
    dispatch(updateRegion(coords));
  }}
/>
</View>
  /* {markers.map((marker, key) => (
    <View style={styles.card} key={key}>
      <Epicerie epicerie={marker} />
    </View>
  ))} */
// </Animated.ScrollView>
    );
  }
}

export default connect(state => ({
  markers: Object.values(state.epicerie.markers),
  currentSelected: state.epicerie.currentSelected,
}))(EpicerieScrollView);
