import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Text,
  ListView,
  View,
  Button,
  Alert,
  TouchableHighlight,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import { formValueSelector, Field, reduxForm } from "redux-form";
import Input from "./Input";
import Fetcher from "../services/Fetcher";
import PickOpeningHoursRow from "./PickOpeningHoursRow";
import RadioButton from "./RadioButton";
import { Form } from "native-base";
import { getGoogleAutocompleteUrl } from "../services/geolocation";
import type { Marker, Dispatch } from "../types";

type Props = {
  position: Object
};
type RequiredFormValues = {
  name: String,
  address: String
};

const validate = (values: RequiredFormValues) => {
  const errors = {};
  if (!values.name || values.name.length < 2) {
    errors.name = "Required";
  }
  if (!values.address || values.address.length < 2) {
    errors.address = "Required";
  }
  return errors;
};

const onSubmit = (
  { name, address, description, hours }: Marker,
  dispatch: Dispatch,
  { position }
) => {
  const body = {
    title: "Un utilisateur suggère une épicerie.",
    body: `
**Nouvelle épicerie**
\`\`\`json
${JSON.stringify(
      {
        name,
        address,
        coords: {
          latitude: null,
          longitude: null
        },
        description,
        hours
      },
      undefined,
      2
    )}
\`\`\`
**Position de l'utilisateur**
\n\n
\`${JSON.stringify(
      position,
      undefined,
      2
    )}\` ([Streetview](http://maps.google.com/maps?q=&layer=c&cbll=${position.latitude},${position.longitude}&cbp=11,0,0,0,0))
`
  };
  return Fetcher.post("/issues", body).then(
    () => {
      Alert.alert(
        "Merci pour votre aide !",
        "Nous vérifions les informations et ajoutons votre épicerie dès que possible !"
      );
      dispatch({ type: "BACK" });
    },
    () => {
      Alert.alert("Un problème est survenu", "Essayez à nouveau.");
      dispatch({ type: "BACK" });
    }
  );
};

export const days = [
  { day: "Tous", code: "all" },
  { day: "Semaine", code: "week" },
  { day: "Week end", code: "weekend" },
  { day: "Lundi", code: "mon" },
  { day: "Mardi", code: "thu" },
  { day: "Mercredi", code: "tue" },
  { day: "Jeudi", code: "wed" },
  { day: "Vendredi", code: "fri" },
  { day: "Samedi", code: "sat" },
  { day: "Dimanche", code: "sun" }
];

class CreateModalForm extends Component<{}, Props> {
  focusNextField = (nextField: string) => {
    const intance = this.refs[nextField].getRenderedComponent();
    intance.focus();
  };

  state = {
    loading: false,
    dataSource: null
  };
  // dataSource = new ListView.DataSource({
  //   rowHasChanged: (r1, r2) => r1 !== r2,
  // });
  // autocompleteRequestTokens = [];

  componentWillReceiveProps(nextProps) {
    if (nextProps.term && nextProps.term != this.props.term) {
      this.setState({ loading: true });
      // Stop all previous requests
      // this.autocompleteRequestTokens.forEach((requestToken) => requestToken.cancel());

      // Init new autocomplete requests
      // const cancelTokenSource = axios.CancelToken.source();
      // this.autocompleteRequestTokens.push(cancelTokenSource)

      // const url = getGoogleAutocompleteUrl(nextProps.term, nextProps.position);
      // Fetcher.get(url)
      //   .then(response => {
      //     this.setState({
      //       dataSource: this.dataSource.cloneWithRows(
      //         response.data.predictions,
      //       ),
      //       loading: false,
      //     });
      //   })
      //   .catch(() => {
      //     this.setState({ loading: false });
      //   });
    }
    // else if (!nextProps.term || nextProps.term === '') {
    //   this.setState({
    //     dataSource: this.dataSource.cloneWithRows([])
    //   })
    // }
    //
    // if (this.props.validatingAddress != nextProps.validatingAddress && nextProps.validatingAddress === true) {
    //   this.setState({
    //     shouldFocusField: false
    //   })
    // }
  }

  onAddressSelected(rowData) {
    console.log(rowData);
    // this.props.onAddressSelected(rowData)
  }

  render() {
    const {
      form,
      horairesAreKnown,
      invalid,
      submitting,
      handleSubmit
    } = this.props;
    const disabled = invalid || submitting;
    return (
      <Form>
        <Field
          ref="2"
          withRef
          autoFocus
          component={Input}
          label={"Nom"}
          name="name"
          highlightColor={"#00BCD4"}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => this.focusNextField("2")}
        />
        <Field
          ref="2"
          withRef
          component={Input}
          name="address"
          label="Adresse"
          highlightColor={"#00BCD4"}
          returnKeyType="next"
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit={false}
          clearButtonMode={"always"}
          onSubmitEditing={() => this.focusNextField("3")}
        />
        {/* {
          <View style={{ position: 'relative', alignSelf: 'stretch' }}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
              {this.state.dataSource &&
                <ListView
                  dataSource={this.state.dataSource}
                  keyboardShouldPersistTaps={'always'}
                  enableEmptySections
                  renderRow={(rowData, sectionID, rowID, highlightRow) =>
                    <TouchableHighlight
                      onPress={() => {
                        this.onAddressSelected(rowData);
                        highlightRow(sectionID, rowID);
                      }}>
                      <View style={styles.row}>
                        <Text>
                          {rowData.description}
                        </Text>
                      </View>
                    </TouchableHighlight>}
                  renderSeparator={(sectionID, rowID) =>
                    <View
                      key={`${sectionID}-${rowID}`}
                      style={{ backgroundColor: '#FFF', height: 1 }}
                    />}
                />}
            </View>
          </View>
        } */}
        <Field
          ref="3"
          withRef
          multiline
          component={Input}
          name="description"
          label={`Description (facultatif)`}
          numberOfLines={3}
          highlightColor={"#00BCD4"}
          // onSubmitEditing={handleSubmit(onSubmit)}
          returnKeyType="done"
        />
        <Text style={{ marginTop: 15 }} />
        <Field
          name="horairesAreKnown"
          options={["Horaires connus", "Horaires inconnus"]}
          component={RadioButton}
        />
        <Text style={{ marginTop: 15 }} />
        {horairesAreKnown === "Horaires connus" &&
          days.map((day, index) =>
            <PickOpeningHoursRow
              style={{ flex: 1, flexDirection: "row", marginBottom: 30 }}
              form={form}
              day={day}
              key={index}
            />
          )}
        <Text style={{ marginTop: 20 }} />
        {submitting
          ? <ActivityIndicator />
          : <Button
              color={disabled ? "#31A69A" : "#178c80"}
              disabled={disabled}
              onPress={!disabled ? handleSubmit(onSubmit) : () => {}}
              title="Envoyer"
            />}
      </Form>
    );
  }
}

const connector = connect((state: State) => ({
  position: state.location.location,
  term: formValueSelector("create")(state, "address"),
  horairesAreKnown: formValueSelector("create")(state, "horairesAreKnown"),
  initialValues: {
    hours: {},
    description: "",
    horairesAreKnown: "Horaires inconnus",
    daysOpen: {
      all: false,
      week: false,
      weekend: false,
      mon: false,
      thu: false,
      tue: false,
      wed: false,
      fri: false,
      sat: false,
      sun: false
    }
  }
}));

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFF",
    padding: 10
  }
});

export default connector(
  reduxForm({
    form: "create",
    onSubmit,
    validate
  })(CreateModalForm)
);
