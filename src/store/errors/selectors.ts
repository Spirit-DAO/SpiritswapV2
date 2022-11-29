import { RootState } from 'store';

export const selectUnexpectedError = (state: RootState) =>
  state.errors.unexpectedError;
