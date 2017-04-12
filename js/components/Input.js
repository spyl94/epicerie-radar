import React from 'react';
import TextField from 'react-native-md-textinput';
// import { TextInput } from 'react-native';

const Input = ({ input: { onChange, onFocus, value }, ...otherProps }) => (
    <TextField
      {...otherProps}
      onChangeText={onChange}
      onFocus={onFocus}
      value={value}
    />
);

export default Input;
