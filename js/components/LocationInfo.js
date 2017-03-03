// @flow
import React from 'react'
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';

type Props = { enabled: ?boolean };
function LocationInfo ({ enabled }: Props) {
  if (enabled === false) {
    return (
      <View>
        <Text style={styles.errorMsg}>Service de localisation GPS désactivé</Text>
      </View>
		);
  }
	return <View></View>;
}

export default connect(
  state => ({
    locationEnabled: state.location.enabled,
  })
)(LocationInfo);

var styles = StyleSheet.create({
	errorMsg : {
    color: 'white',
    padding: 12,
    backgroundColor: '#178c80',
		textAlign: "center",
	},
})
