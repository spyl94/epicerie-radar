import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './App';

import configureStore from '../redux/store';

export default class AppContainer extends Component {
    render() {
        return (
            <Provider store={configureStore()}>
              <App />
            </Provider>
        );
    }
}
