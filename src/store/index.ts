import {
  Action,
  combineReducers,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { createTransform, persistReducer } from 'redux-persist';

import user from './user';
import general from './general';
import farms from './farms';
import errors from './errors';
import features from './features';
import settings from './settings';
import burnV3 from './v3/burn';
import mintV3 from './v3/mint';

export const JSONTransform = createTransform(
  (inboundState, key) => JSON.stringify(inboundState),
  (outboundState, key) => JSON.parse(outboundState),
);

const persistConfig = {
  key: 'root',
  storage,
  transforms: [JSONTransform],
};

const reducers = combineReducers({
  user,
  general,
  farms,
  errors,
  features,
  settings,
  burnV3,
  mintV3,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: customizedMiddleware,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
