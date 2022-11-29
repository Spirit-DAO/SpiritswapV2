import { colors } from '../../base/color';
import { borderRadius } from '../../base/borderRadius';
import { fontSize } from '../../base/fontSize';

const numberInput = {
  parts: ['addon', 'field', 'element'],
  baseStyle: {
    field: {
      bg: 'bgBoxLighter',
      color: colors.white,
      borderRadius: borderRadius.sm,
      border: '1px solid transparent',
      p: 'spacing02 0',
      pr: '0',
      w: {
        base: '170px',
        md: '270px',
      },
      _focus: {
        border: '1px solid ciDark',
        borderColor: 'ciDark',
      },
      _invalid: {
        borderColor: 'error',
      },
    },
  },

  sizes: {},

  variants: {
    default: {
      field: {
        fontSize: fontSize.xl2,
      },
    },
    primary: {
      size: 'lg',
      field: {
        bg: 'bgBoxLighter',
        border: '1px solid ciDark',
        borderColor: 'ciDark',
      },
    },
    noBorder: {
      field: {
        border: 'none',
      },
    },
  },

  defaultProps: {
    variant: 'default',
  },
};

export default numberInput;
