/* @flow */
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import composeWithDevTools from 'remote-redux-devtools';
import reducer from './reducers';

export default function configureStore(initialState = {}) {
    const sagaMiddleware = createSagaMiddleware();
    const enhancer = composeWithDevTools(
        applyMiddleware(sagaMiddleware),
    );
    const store = createStore(
      reducer,
      initialState,
      enhancer
    );
    return store;
}
