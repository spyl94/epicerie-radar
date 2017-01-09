import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function LocationInfo ({ enabled }) {
  if (enabled === false) {
    return (
      <View>
        <Text style={styles.errorMsg}>Service de localisation GPS désactivé</Text>
      </View>
		);
  }
	return <View></View>;
}

var styles = StyleSheet.create({
	errorMsg : {
    color: 'white',
    padding: 12,
    backgroundColor: '#178c80',
		textAlign: "center",
	},
})
