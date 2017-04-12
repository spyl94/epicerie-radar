import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import EditModalNavbarRight from './EditModalNavbarRight';
import EditModalForm from './EditModalForm';

class EditModal extends Component<{}, {}> {
  static navigationOptions = {
    header: {
      title: 'Modifier les horaires d\'ouverture',
      right: (<EditModalNavbarRight />),
    },
  };

  render() {
    return (
      <View style={styles.container}>
        <EditModalForm />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20
  },
});

export default EditModal;
