import { colors } from 'theme/base/color';
import { spacing } from 'theme/base/spacing';

const Container = {
  baseStyle: {
    bg: colors.bgBox,
    p: spacing.spacing06,
    borderRadius: spacing.spacing03,
    borderBottomRadius: 'none',
    border: `1px solid ${colors.grayBorderBox}`,
  },
};

export default Container;
