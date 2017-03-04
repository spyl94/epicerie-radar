// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import configureStore from '../redux/store';
import EntryPoint from './EntryPoint';

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
