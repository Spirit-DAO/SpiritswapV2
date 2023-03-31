import { baseTheme } from 'theme/base';
import { colors, colorValues } from 'theme/base/color';

export const darkTheme = {
  ...baseTheme,
  name: 'dark',
  color: {
    ...colors,

    ci: colorValues.bluegray[600],
    ciDark: colorValues.bluegray[600],
    ciTrans15: colorValues.bluegray.ciTrans15,

    danger: colorValues.red[500],
    dangerDark: colorValues.red['redTrans10'],

    bgDark: colorValues.gray[900],
    bgBox: colorValues.gray[700],
    bgBoxDarker: colorValues.gray[600],
    bgBoxLighter: colorValues.gray[600],
    bgInput: colorValues.gray[100],
    secondary: colorValues.gray[100],
  },
};
