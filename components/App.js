// @flow
import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import configureStore from '../redux/store';
import AppNavigator from './AppNavigator';

const AppWithNavigationState = connect(state => ({
  nav: state.nav,
}))(({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
));

export default class App extends Component {
    store = configureStore();

    render() {
        return (
            <Provider store={this.store}>
              <AppWithNavigationState />
            </Provider>
        );
    }
}
