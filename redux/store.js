import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import devTools from 'remote-redux-devtools';
import reducer from './reducers';

export default function configureStore(initialState) {
    const sagaMiddleware = createSagaMiddleware()
    const enhancer = compose(
        applyMiddleware(sagaMiddleware),
        devTools()
    );
    const store = createStore(
      reducer,
      initialState,
      enhancer
    );
    devTools.updateStore(store);
    return store;
}
