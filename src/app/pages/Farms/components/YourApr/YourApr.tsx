import { useTranslation } from 'react-i18next';
import { PercentBadge } from 'app/components/PercentBadge';
import { CheckmarkIcon, RocketIcon, WarningIcon } from 'app/assets/icons';
import { Props } from './YourApr.d';
import { StyledContainer, StyledParagraph, StyledWrapper } from './styles';
import { EcosystemFarmType } from 'app/interfaces/Farm';
import { BoostFactor } from '../BoostFactor';
import { Box, HStack, Text } from '@chakra-ui/react';

const YourApr = ({
  label,
  value,
  isExpanded,
  ecosystem,
  isBoosted,
  isMax,
  farmUserData,
}: Props) => {
  const { t } = useTranslation();
  label =
    label ||
    t(
      ecosystem
        ? 'liquidity.common.APR'
        : !isMax
        ? 'farms.common.yourApr'
        : 'farms.common.maxApr',
    );

  return (
    <StyledContainer>
      <StyledWrapper>
        <HStack>
          <StyledParagraph>{label}</StyledParagraph>
          <PercentBadge amount={value} sign={0} showIcon={false} />

          {isBoosted && !ecosystem ? (
            <RocketIcon color="ci" />
          ) : ecosystem === EcosystemFarmType.UNVERIFIED ? (
            <WarningIcon color="warning" />
          ) : (
            <CheckmarkIcon color="ci" />
          )}
        </HStack>

        {isBoosted && isExpanded && (
          <BoostFactor
            key="boostfactor"
            currentBoost={farmUserData.currentBoost || '0'}
            holdAmountForMaxBoost={farmUserData.spiritNeededForMax || '0'}
            lpTokens={farmUserData.lpTokens}
          />
        )}
      </StyledWrapper>
    </StyledContainer>
  );
};

export default YourApr;
