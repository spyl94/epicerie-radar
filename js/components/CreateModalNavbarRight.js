import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { isValid, isSubmitting, submit } from 'redux-form';
import Icon from 'react-native-vector-icons/MaterialIcons';

class CreateModalNavbarRight extends Component<{}, {}> {
  render() {
    const { valid, dispatch, submitting } = this.props;
    if (submitting) return <ActivityIndicator style={{ marginRight: 10 }} />;
    return (
      <Icon
        onPress={valid ? () => { dispatch(submit('create'))} : null}
        name="check"
        size={24}
        color={valid ? "#178c80" : "#d3d3d3"}
        style={{ marginRight: 10 }}
      />
    );
  }
}

const connector = connect(state => ({
  submitting: isSubmitting('create')(state),
  valid: isValid('create')(state),
}));

export default connector(CreateModalNavbarRight);
