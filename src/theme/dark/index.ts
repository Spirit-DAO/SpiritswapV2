import { baseTheme } from 'theme/base';
import { colors, colorValues } from 'theme/base/color';

export const darkTheme = {
  ...baseTheme,
  name: 'dark',
  color: {
    ...colors,

    ci: colorValues.teal[400],
    ciDark: colorValues.teal[600],
    ciTrans15: colorValues.teal.ciTrans15,

    danger: colorValues.red[500],
    dangerDark: colorValues.red['redTrans10'],

    bgDark: colorValues.blue[900],
    bgBox: colorValues.gray[800],
    bgBoxDarker: colorValues.gray[900],
    bgBoxLighter: colorValues.gray[700],
    bgInput: colorValues.gray[600],
    secondary: colorValues.gray[500],
  },
};
