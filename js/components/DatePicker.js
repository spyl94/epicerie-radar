import React, { Component } from 'react';
import DatePicker from 'react-native-datepicker';

class Input extends Component<{}, {}> {
  render() {
    const { input: { onChange, value }, ...otherProps } = this.props;
    return (
      <DatePicker
        {...otherProps}
        date={value}
        mode="time"
        format="HH:mm"
        customStyles={{ dateIcon: { display: 'none' } }}
        onDateChange={onChange}
      />
    );
  }
}

export default Input;
