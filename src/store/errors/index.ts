import { createSlice } from '@reduxjs/toolkit';
import { ErrorState } from './errors';

const initialState: ErrorState = {
  unexpectedError: false,
};

const errorReducers = createSlice({
  name: 'errorReducer',
  initialState,
  reducers: {
    setUnexpectedError: (state, action) => {
      state.unexpectedError = action.payload;
    },
  },
});

// Actions
export const { setUnexpectedError } = errorReducers.actions;
export default errorReducers.reducer;
