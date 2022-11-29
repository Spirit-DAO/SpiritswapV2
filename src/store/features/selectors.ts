import { RootState } from 'store';

export const selectFeatures = (state: RootState) =>
  state.features[state.features.environment];
