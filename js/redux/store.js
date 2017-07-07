// @flow
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers';

const middlewares = [createSagaMiddleware()];
const enhancer = composeWithDevTools({
    // Options: https://github.com/jhen0409/react-native-debugger#options
})(
  applyMiddleware(...middlewares)
);

export default function configureStore() {
    const store = createStore(
      reducer,
      undefined,
      enhancer
    );
    return store;
}
