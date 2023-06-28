import { RootState } from 'store';

export const selectEcosystemValues = (state: RootState) =>
  state.farms.ecosystemValues;

export const selectFarmAddress = (state: RootState) =>
  state.farms.ecosystemValues.ecosystemFarmAddress;

export const selectFarmTokens = (state: RootState) => state.farms.farmTokens;

export const selectEcosystemFarms = (state: RootState) =>
  state.farms.ecosystemFarms;

export const selectFarmMasterData = (state: RootState) =>
  state.farms.farmMasterData;

export const selectBoostedFarms = (state: RootState) =>
  state.farms.boostedFarms;

export const selectConcentratedFarms = (state: RootState) =>
  state.farms.concentratedLiquidityFarms;
