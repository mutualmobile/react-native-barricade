import { configureStore } from "@reduxjs/toolkit";
import { AnyAction, combineReducers } from "redux";
import logger from "redux-logger";
import thunk, { ThunkDispatch } from "redux-thunk";

import globalReducer from "./reducers/global.reducer";
import photoReducer from "./reducers/photo.reducer";

const rootReducer = combineReducers({ globalReducer, photoReducer });

// const Store = () => {
// 	return createStore(rootReducer, applyMiddleware(thunk, logger));
// };

export const store = configureStore({
	reducer: rootReducer,
	middleware: [thunk, logger]
});

export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
export default store;
