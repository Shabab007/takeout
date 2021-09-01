import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { batch, batching } from 'redux-batch-middleware';
import logger from 'redux-logger';

import { createBrowserHistory } from 'history';

import createRootReducer from '../reducers/root-reducer';

const initialState = {};
export const history = createBrowserHistory();

const store = configureStore({
  reducer: batching(createRootReducer(history)),
  middleware: [...getDefaultMiddleware(), routerMiddleware(history), batch, logger],
  preloadedState: initialState,
  devTools: process.env.NODE_ENV !== 'production',
  // enhancers,
});

export default store;
