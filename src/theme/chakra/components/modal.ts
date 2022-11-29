import type { ComponentStyleConfig } from '@chakra-ui/theme';
import { colors } from 'theme/base/color';
import { spacing } from 'theme/base/spacing';
import { fontSize } from 'theme/base/fontSize';
import { fontWeight } from 'theme/base/fontWeight';
import { lineHeight } from 'theme/base/lineHeight';

const Modal: ComponentStyleConfig = {
  parts: ['dialog', 'header', 'closeButton', 'body', 'footer'],
  baseStyle: {
    dialog: {
      bg: colors.bgBox,
      border: `1px solid ${colors.grayBorderBox}`,
    },
  },
  variants: {
    questionHelper: {
      dialog: {
        bg: colors.bgInput,
      },
      header: {
        display: 'flex',
        alignItems: 'center',
        Text: {
          fontSize: fontSize.xl,
          fontWeight: fontWeight.medium,
          lineHeight: lineHeight.h2,
        },
      },
      closeButton: {
        bgColor: 'grayBorderBox',
        borderRadius: '4px',
        mt: spacing.spacing02,
        mr: spacing.spacing03,
      },
      body: {
        color: colors.gray,
        paddingInlineEnd: 'none',
        Heading: {
          fontWeight: fontWeight.medium,
          fontSize: fontSize.base,
          color: 'red',
        },
      },
      footer: {},
    },
  },
  defaultProps: {
    variant: 'default',
  },
};

export default Modal;
