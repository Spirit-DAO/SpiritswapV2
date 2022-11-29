import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PercentBadge } from 'app/components/PercentBadge';
import { CheckmarkIcon, RocketIcon, WarningIcon } from 'app/assets/icons';
import { Props } from './YourApr.d';
import { StyledContainer, StyledParagraph, StyledWrapper } from './styles';
import { EcosystemFarmType } from 'app/interfaces/Farm';

const YourApr: FC<Props> = ({
  label,
  value,
  ecosystem,
  isBoosted,
  isMax,
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
        <StyledParagraph>{label}</StyledParagraph>
        <PercentBadge amount={value} sign={0} showIcon={false} />

        {isBoosted && !ecosystem ? (
          <RocketIcon color="ci" />
        ) : ecosystem === EcosystemFarmType.UNVERIFIED ? (
          <WarningIcon color="warning" />
        ) : (
          <CheckmarkIcon color="ci" />
        )}
      </StyledWrapper>
    </StyledContainer>
  );
};

export default YourApr;
