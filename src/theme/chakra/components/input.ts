import { borderRadius } from '../../base/borderRadius';
import { fontSize } from '../../base/fontSize';
import { spacing } from '../../base/spacing';

const Input = {
  parts: ['addon', 'field', 'element'],
  baseStyle: {
    field: {
      bg: 'bgInput',
      color: 'white',
      borderRadius: borderRadius.sm,
      border: '1px solid transparent',
      p: `${spacing.spacing02} 0`,
      _hover: {
        bg: 'bgInput',
      },
      _focus: {
        bg: 'bgInput',
        borderColor: 'ciDark',
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
        bg: 'bgInput',
        border: '1px solid',
        borderColor: 'ciDark',
      },
    },
  },

  defaultProps: {
    variant: 'default',
  },
};

export default Input;
