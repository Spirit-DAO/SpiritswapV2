import { borderRadius } from 'theme/base/borderRadius';
import { fontSize } from 'theme/base/fontSize';
import { fontWeight } from 'theme/base/fontWeight';
import { opacity } from 'theme/base/opacity';
import { colors } from '../../base/color';

const { ciDark, white, ciTrans15, ci } = colors;

const Button = {
  baseStyle: {
    color: white,
    border: `1px solid ${ciTrans15}`,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: '24px',
    cursor: 'pointer',
    borderRadius: borderRadius.sm,
    _hover: {
      opacity: opacity.opacity08,
    },
    _focus: { boxShadow: 'none' },
    _active: { border: `1px solid ${ci}` },
  },

  sizes: {
    sm: {
      h: '28px',
      p: '4px, 8px, 4px, 8px',
    },
    md: {
      h: '32px',
      p: '6px 8px',
      fontSize: fontSize.sm,
    },
    lg: {
      h: '40px',
      p: '8px',
      lineHeight: '24px',
      fontSize: fontSize.lg,
      fontWeight: fontWeight.medium,
    },
  },

  variants: {
    primary: {
      bg: ciDark,
      _hover: { _disabled: { bgColor: ciDark, opacity: opacity.opacity04 } },
      _disabled: {
        opacity: opacity.opacity04,
      },
    },
    topBar: {
      h: '26px',
      p: '4px, 8px, 4px, 8px',
      bg: ciDark,
      border: 'none',
      _active: {
        border: 'none',
      },
    },
    bridge: {
      h: 'auto',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    iconButton: {
      color: 'ci',
      bg: 'none',
      border: 'none',
      size: 'md',
      _hover: {
        color: 'ci',
      },
      _active: {
        border: 'none',
      },
    },
    danger: ({ colorMode }: any) => ({
      bg: colorMode === 'dark' ? colors.danger : ci,
      borderColor: colors.dangerBorder,
      _active: {
        borderColor: colors.dangerLight,
      },
    }),
    secondary: ({ colorMode }: any) => ({
      bg: colorMode === 'dark' ? colors.secondary : ci,
      borderColor: 'transparent',
      _active: {
        borderColor: colors.grayDarker,
      },
      _disabled: {
        cursor: 'not-allowed',
        opacity: opacity.opacity02,
        _active: {
          border: '1px solid transparent',
        },
      },
      _hover: {
        _disabled: { bgColor: colors.secondary, opacity: opacity.opacity02 },
      },
    }),
    inverted: ({ colorMode, isDisabled }: any) => ({
      bg: colorMode === 'dark' ? ciTrans15 : ci,
      color: ci,
      borderColor: 'transparent',

      _hover: !isDisabled && {
        opacity: opacity.opacity08,
      },
      _focus: !isDisabled && { boxShadow: 'none' },
      _active: !isDisabled && { border: `1px solid ${ci}` },
    }),
  },

  defaultProps: {
    size: 'md',
    variant: 'primary',
  },
};

export default Button;
