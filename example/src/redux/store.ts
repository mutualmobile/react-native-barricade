import { configureStore } from '@reduxjs/toolkit';
import { AnyAction, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk, { ThunkDispatch } from 'redux-thunk';

import { globalReducer, photoReducer } from './reducers';

const rootReducer = combineReducers({ globalReducer, photoReducer });

export const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk, logger],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
