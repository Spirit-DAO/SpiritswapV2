import { createSlice } from '@reduxjs/toolkit';
import { InitialStateProps } from './farms.d';
import tokens, { WFTM } from 'constants/tokens';

const initialState: InitialStateProps = {
  ecosystemValues: {
    token1: {
      ...tokens[0],
      address: WFTM.address,
    },
    token2: tokens[1],
    emissionToken: {
      ...tokens[0],
      address: WFTM.address,
    },
    emissionAmount: 0,
    emissionRate: '',
    emissionSchedule: {
      value: 14,
      index: 0,
    },
    pairError: false,
    lpTokenAddress: '',
    ecosystemFarmAddress: '',
  },
  farmTokens: tokens,
  customFarmTokens: tokens,
  ecosystemFarms: [],
  farmMasterData: [],
};

export const farmsReducer = createSlice({
  name: 'farmsReducer',
  initialState,
  reducers: {
    setEcosystemValues: (state, action) => {
      state.ecosystemValues = action.payload;
    },
    resetEcosystemValues: state => {
      state.ecosystemValues = initialState.ecosystemValues;
    },
    setPairError: (state, action) => {
      state.ecosystemValues.pairError = action.payload;
    },
    setLpTokenAddress: (state, action) => {
      state.ecosystemValues.lpTokenAddress = action.payload;
    },
    setEcosystemFarmAddress: (state, action) => {
      state.ecosystemValues.ecosystemFarmAddress = action.payload;
    },
    setFarmTokens: (state, action) => {
      state.farmTokens = action.payload;
    },
    setEcosystemFarms: (state, action) => {
      state.ecosystemFarms = action.payload;
    },
    setFarmMasterData: (state, action) => {
      state.farmMasterData = action.payload;
    },
  },
});

// Actions
export const {
  setEcosystemValues,
  resetEcosystemValues,
  setPairError,
  setLpTokenAddress,
  setEcosystemFarmAddress,
  setFarmTokens,
  setEcosystemFarms,
  setFarmMasterData,
} = farmsReducer.actions;

export default farmsReducer.reducer;
