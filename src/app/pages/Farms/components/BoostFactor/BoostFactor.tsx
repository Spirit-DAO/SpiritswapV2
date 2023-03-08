import { FC } from 'react';
import {
  StyledContainer,
  StyledDoughnutWrapper,
  StyledInSpirit,
  StyledDoughnutText,
  StyledCurrentBoost,
  StyledText,
  StyledParagraph,
  StyledTextGraph,
} from './styles';
import { darkTheme } from '../../../../../theme/dark/index';
import { useTranslation, Trans } from 'react-i18next';
import { formatNumber } from 'app/utils';
import { HStack, Progress, Text, VStack } from '@chakra-ui/react';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { colors } from 'theme/base/color';
import { fontSize } from 'theme/base/fontSize';
import { fontWeight } from 'theme/base/fontWeight';

const BoostFactor = ({ currentBoost, holdAmountForMaxBoost, lpTokens }) => {
  const { t } = useTranslation();
  const translationPath = 'farms.boostInfoPanel';
  const currentBoostValue = parseFloat(currentBoost);

  const amountforMaxBoostValue = formatNumber({
    value: parseFloat(holdAmountForMaxBoost),
    maxDecimals: 0,
  });
  const percetage = (currentBoostValue * 100) / 2.5;

  const yourBoostFactorText = t(`${translationPath}.yourBoostFactor`);

  const showProgressbar = parseFloat(lpTokens) && currentBoostValue <= 2.5;

  const BoostMessage = () => {
    if (!parseFloat(lpTokens)) {
      return <StyledText>{t(`${translationPath}.noBoostTokens`)}</StyledText>;
    }

    if (currentBoostValue >= 2.5) {
      return (
        <StyledText>{t(`${translationPath}.maxBoostAchieved`)}</StyledText>
      );
    }

    return (
      <HStack alignItems="center" justifyContent="center">
        <StyledText>Hold</StyledText>
        <StyledText color={colors.white}>{amountforMaxBoostValue}</StyledText>
        <StyledText color={colors.ci}>inSPIRIT</StyledText>
        <StyledText>for 2.5x boost.</StyledText>
      </HStack>
    );
  };

  return (
    <StyledContainer>
      <VStack justifyContent="center" alignItems="center" mb="10px">
        <HStack>
          <StyledParagraph>{yourBoostFactorText}</StyledParagraph>
        </HStack>
        <Text
          mt="0px !important"
          color={colors.ci}
          fontSize={fontSize.h3}
          fontWeight={fontWeight.bold}
        >{`${currentBoostValue}x`}</Text>
      </VStack>

      <HStack
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        mb="5px"
      >
        <StyledInSpirit />
        <BoostMessage />
        <QuestionHelper
          title={t(`${translationPath}.yourBoostFactor`)}
          text={t(`${translationPath}.boostfactorExplanation`)}
        />
      </HStack>
      {showProgressbar ? (
        <Progress
          max={100}
          min={0}
          style={{ borderRadius: '12px' }}
          size="sm"
          value={percetage}
        />
      ) : null}
    </StyledContainer>
  );
};

export default BoostFactor;
