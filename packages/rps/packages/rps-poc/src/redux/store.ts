import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducer';
const sagaMiddleware = createSagaMiddleware();

import loginSaga from './login/saga';
const composeEnhancers = (window as  any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancers = composeEnhancers(
  applyMiddleware(sagaMiddleware),
);

const store = createStore(reducer, enhancers);
sagaMiddleware.run(loginSaga);

export default store;

export const getApplicationState = (storeObj: any) => storeObj.app;
export const getWalletState = (storeObj: any) => storeObj.wallet;
export const getUser = (storeObj: any) => storeObj.login.user;
