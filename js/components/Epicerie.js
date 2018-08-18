// @flow
import React, { PureComponent } from "react";
import { StyleSheet, Text, View, Alert, Button } from "react-native";
import { connect } from "react-redux";
import { reportNotExisting } from "../redux/modules/epicerie";
import { navigateToEditModal } from "../redux/modules/nav";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

class Epicerie extends PureComponent {
  render() {
    const { dispatch, epicerie } = this.props;
    return (
      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {epicerie.name}{" "}
          <MaterialIcon
            onPress={() => {
              dispatch(navigateToEditModal());
            }}
            name="edit"
            size={24}
            color="#178c80"
            style={{ marginLeft: 10 }}
          />
          <MaterialIcon
            onPress={() => {
              Alert.alert(
                "Signaler une fermeture définitive",
                "Confirmez vous que cette épicerie n'existe pas ?",
                [
                  { text: "Annuler", onPress: () => {}, style: "cancel" },
                  {
                    text: "Oui",
                    onPress: () => reportNotExisting(dispatch, epicerie)
                  }
                ],
                { cancelable: true }
              );
            }}
            name="delete"
            size={24}
            color="#178c80"
            style={{ marginLeft: 10 }}
          />
        </Text>
        <Text style={{ fontSize: 18 }}>
          {epicerie.distance &&
            `${epicerie.duration.text} (${epicerie.distance.text})`}
        </Text>
        <Text style={{ fontSize: 16 }}>
          {epicerie.address}
        </Text>
        <Text style={{ fontSize: 16, color: epicerie.color }}>
          {epicerie.text}
        </Text>
        {/* <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <Button
            onPress={() => {
              Alert.alert(
                "Signaler une fermeture définitive",
                "Confirmez vous que cette épicerie n'existe pas ?",
                [
                  { text: "Annuler", onPress: () => {}, style: "cancel" },
                  {
                    text: "Oui",
                    onPress: () => reportNotExisting(dispatch, epicerie)
                  }
                ],
                { cancelable: true }
              );
            }}
            title={
              isReporting
                ? "Signalement en cours..."
                : "Signaler fermeture définitive"
            }
            color={isReporting ? "#31A69A" : "#178c80"}
          />
          <Text style={{ minHeight: 10, marginBottom: 10 }}> </Text>
        </View> */}
      </View>
    );
  }
}

export default connect(state => ({
  epicerie: state.epicerie.markers[state.epicerie.currentSelected],
  isReporting: state.epicerie.isReporting
}))(Epicerie);
