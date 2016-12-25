import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function LocationInfo ({enabled}) {
  if (enabled === false) {
    return (
      <View>
        <Text style={styles.errorMsg}>Impossible de récupérer votre position :-(</Text>
      </View>
		);
  }
	return <View></View>;
}

var styles = StyleSheet.create({
	errorMsg : {
		fontSize: 12,
    height: 30,
    padding: 7,
    backgroundColor: '#178c80',
		textAlign: "center",
	},
})
