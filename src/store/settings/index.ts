import { createSlice } from '@reduxjs/toolkit';
import { Settings } from './settings';
import { isMobile } from 'utils/isMobile';

const initialState: Settings = {
  notifications: !isMobile(),
  suggestions: true,
  keepSuggestions: false,
};

const settingsReducer = createSlice({
  name: 'settingsReducer',
  initialState,
  reducers: {
    setUserNotifications: (state, { payload }) => {
      state.notifications = payload.notifications;
    },
    setUserSuggestions: (state, { payload }) => {
      state.suggestions = payload.suggestions;
    },
    setKeepSuggestions: (state, { payload }) => {
      state.keepSuggestions = payload.keepSuggestions;
    },
  },
});

export const { setUserNotifications, setUserSuggestions, setKeepSuggestions } =
  settingsReducer.actions;

export default settingsReducer.reducer;
