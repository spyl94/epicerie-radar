import React from 'react';
import { Switch as NativeSwitch } from 'react-native';

const Switch = ({ input: { onChange, onFocus, value }, ...otherProps }) => (
    <NativeSwitch
      {...otherProps}
      onValueChange={onChange}
      onFocus={onFocus}
      value={value}
    />
);

export default Switch;
