import { createSlice } from '@reduxjs/toolkit';
import { FeatureFlags } from './features';

const initialState: FeatureFlags = {
  environment: `${process.env.NODE_ENV}`,
  development: {
    apemode: false,
  },
  production: {
    apemode: false,
  },
};

const featureReducers = createSlice({
  name: 'featureReducer',
  initialState,
  reducers: {},
});

export default featureReducers.reducer;
