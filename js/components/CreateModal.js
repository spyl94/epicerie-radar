import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CreateModalForm from './CreateModalForm';
import CreateModalNavbarRight from './CreateModalNavbarRight';

class CreateModal extends Component<{}, {}> {
  static navigationOptions = {
    header: {
      title: 'Ajouter une épicerie',
      right: <CreateModalNavbarRight />,
    },
  };

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={{ marginLeft: 10, marginRight: 10 }}>
            <CreateModalForm />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
});

export default CreateModal;
