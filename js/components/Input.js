import React, { Component } from 'react';
import TextField from 'react-native-md-textinput';

class Input extends Component<{}, {}> {
    render() {
      const { input: { onChange, onFocus, value }, getInputRef, ...otherProps } = this.props;
      const getRef = getInputRef ? (element) => getInputRef(element) : null;
      return (
        <TextField
          {...otherProps}
          onChangeText={onChange}
          onFocus={onFocus}
          value={value}
          ref={getRef}
        />
      )
    }
}

export default Input;
