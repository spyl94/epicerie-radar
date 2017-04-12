import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isDirty, submit } from 'redux-form';
import Icon from 'react-native-vector-icons/MaterialIcons';

class EditModalNavbarRight extends Component<{}, {}> {
  render() {
    const { valid, dispatch } = this.props;
    return (
      <Icon
        onPress={valid ? () => { dispatch(submit('update-horaires'))} : null}
        name="check"
        size={24}
        color={valid ? "#178c80" : "#d3d3d3"}
        style={{ marginRight: 10 }}
      />
    );
  }
}

const connector = connect(state => ({
  valid: isDirty('update-horaires')(state),
}));

export default connector(EditModalNavbarRight);
