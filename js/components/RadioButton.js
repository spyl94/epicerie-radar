import React from 'react';
import { SegmentedControls } from 'react-native-radio-buttons';

const RadioButton = ({ input: { onChange, value }, ...otherProps }) =>
  <SegmentedControls
    tint={'#178c80'}
    {...otherProps}
    onSelection={onChange}
    selectedOption={value}
  />;

export default RadioButton;
