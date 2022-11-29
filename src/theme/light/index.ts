import { baseTheme } from 'theme/base';
import { colors } from 'theme/base/color';

export const lightTheme = {
  ...baseTheme,
  name: 'light',
  color: {
    ...colors,
    // TODO: this is just for testing
    bgDark: '#CBCFD7',
  },
};
