import React, { Component } from 'react';
import { Item, Input, Label } from 'native-base';

class InputComponent extends Component<{}, {}> {

    focus() {
      this.refs.children.focus();
    }

    render() {
      const { input: { onChange, onFocus, value }, label, ...otherProps } = this.props;
      return (
        <Item floatingLabel>
          <Label>{label}</Label>
          <Input
            ref="children"
            {...otherProps}
            onChangeText={onChange}
            onFocus={onFocus}
            value={value}
          />
        </Item>
      )
    }
}

// {/* <TextField
//   ref="children"
//   {...otherProps}
//   onChangeText={onChange}
//   onFocus={onFocus}
//   value={value}
// /> */}
export default InputComponent;
