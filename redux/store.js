// @flow
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers';

export default function configureStore() {
    const sagaMiddleware = createSagaMiddleware();
    const composeEnhancers = composeWithDevTools({});
    const enhancer = composeEnhancers(
        applyMiddleware(sagaMiddleware),
    );
    const store = createStore(
      reducer,
      undefined,
      enhancer
    );
    return store;
}
