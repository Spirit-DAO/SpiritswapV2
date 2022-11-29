import { StepsStyleConfig } from 'chakra-ui-steps';
import { fontSize } from 'theme/base/fontSize';
import { fontFamily } from 'theme/base/fontFamily';
import { spacing } from 'theme/base/spacing';
import { colors } from 'theme/base/color';
import { fontWeight } from '../../base/fontWeight';

export const CustomChakraSteps = {
  ...StepsStyleConfig,
  baseStyle: props => {
    return {
      ...StepsStyleConfig.baseStyle(props),
      labelContainer: {
        borderBottomWidth: '5px',
        paddingBottom: '5px',
        width: '100%',
        borderColor: colors.ciTrans15,
        color: colors.grayDarker,
        _activeStep: {
          borderColor: colors.ci,
          color: colors.white,
        },
      },
      label: {
        margin: '0',
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.medium,
        fontSize: fontSize.base,
      },
      connector: {
        display: 'none',
      },
      stepIconContainer: {
        display: 'none',
      },
      step: {
        flexGrow: 1,
        flexBasis: 0,
        width: '100%',
      },
      steps: {
        display: 'flex',
        gap: spacing.spacing02,
      },
    };
  },
};
