// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../redux/store';
import EntryPoint from './EntryPoint';

// Debug requests with chrome
global.XMLHttpRequest = global.originalXMLHttpRequest
  ? global.originalXMLHttpRequest
  : global.XMLHttpRequest;

// global.FormData = global.originalFormData ?
//     global.originalFormData :
//     global.FormData;

export default class App extends Component {
  store = configureStore();

  render() {
    return (
      <Provider store={this.store}>
        <EntryPoint />
      </Provider>
    );
  }
}
