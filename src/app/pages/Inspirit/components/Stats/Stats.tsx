import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Props as StatsProps } from './Stats.d';
import {
  StyledContent,
  StyledDataBox,
  StyledLabel,
  StyledTitleBox,
  StyledValue,
  StyledSubText,
} from './styles';

import { DateTime } from 'app/components/DateTime';
import { SimpleGrid, Box, VStack } from '@chakra-ui/react';
import { CardHeader } from 'app/components/CardHeader';
import { STATS } from 'constants/icons';
import isMobile from 'utils/isMobile';
import { formatNumber, GetInspiritData } from 'app/utils';
import { StyledPanel } from '../../styles';
import moment from 'moment';

const defaultTranslations = {
  titleLabel: 'inSpirit.stats.title',
  totalSpiritLockedLabel: 'inSpirit.stats.totalSpiritLocked',
  totalDistributionLabel: 'inSpirit.stats.totalDistribution',
  averageUnlockTimeLabel: 'inSpirit.stats.averageUnlockTime',
  aprLabel: 'inSpirit.stats.apr',
  spiritPerInspiritLabel: 'inSpirit.stats.spiritPerInspirit',
  nextDistributionLabel: 'inSpirit.stats.nextDistribution',
  selectLabels: [
    'inSpirit.stats.selectLabels.week',
    'inSpirit.stats.selectLabels.month',
    'inSpirit.stats.selectLabels.year',
    'inSpirit.stats.selectLabels.all',
  ],
};

const Stats = ({ dataLabels = defaultTranslations }: StatsProps) => {
  const {
    titleLabel,
    totalDistributionLabel,
    aprLabel,
    spiritPerInspiritLabel,
    nextDistributionLabel,
  } = dataLabels;

  const {
    totalSpiritLockedUSD: totalLockedUSD,
    statisticsFromTimestamp,
    totalSpiritLocked,
    spiritPerInspirit,
    lastSpiritDistribution,
    totalDistributionUSD: totalDistributionUSDOriginal,
    averageSpiritUnlockTime,
    nextSpiritDistribution,
    aprValue: APR,
  } = GetInspiritData();

  const statsDataValues = {
    selectedDate: moment.unix(statisticsFromTimestamp).format(),

    totalSpiritLockedUSD: `$${formatNumber({
      value: totalLockedUSD,
      hideDecimals: true,
    })}`,

    totalDistributionUSD: `$${formatNumber({
      value: totalDistributionUSDOriginal,
      hideDecimals: true,
    })}`,
    averageUnlockTimeValue: averageSpiritUnlockTime,

    aprValue: APR.toFixed(2),

    spiritPerInspiritValue: spiritPerInspirit.toFixed(3),

    totalDistributionValue: formatNumber({
      value: +lastSpiritDistribution,
      hideDecimals: true,
    }),

    totalSpiritLockedValue: formatNumber({
      value: totalSpiritLocked,
      hideDecimals: true,
    }),

    nextDistributionValue: moment
      .unix(+nextSpiritDistribution)
      .format('DD MMM YYYY'),
  };

  const {
    totalSpiritLockedValue,
    totalSpiritLockedUSD,
    totalDistributionValue,
    totalDistributionUSD,
    aprValue,
    spiritPerInspiritValue,
    nextDistributionValue,
    averageUnlockTimeValue,
  } = statsDataValues;

  const { t } = useTranslation();
  const translationPathHelper = 'inSpirit.modalHelper';

  const renderHeader = (): ReactNode => (
    <>
      <StyledContent>
        <CardHeader
          title={t(titleLabel)}
          id={STATS}
          helperContent={{
            title: t(`${translationPathHelper}.inpiritStats`),
            text: t(`${translationPathHelper}.inpiritStatsExplanation`),
            showDocs: true,
          }}
        />
      </StyledContent>

      <SimpleGrid
        columns={isMobile() ? 1 : 2}
        fontSize="sm"
        fontWeight="400"
        color="grayDarker"
        m={['20px 10px', '20px 10px', '20px 0px']}
        gap="20px"
      >
        <VStack alignItems="flex-start">
          <Box>Total SPIRIT Locked</Box>
          <Box fontSize="xl" fontWeight="500" color="white">
            {totalSpiritLockedValue} SPIRIT
          </Box>
          <Box>{totalSpiritLockedUSD}</Box>
        </VStack>
        <VStack alignItems="flex-start">
          <Box>Average unlock time</Box>
          <Box fontSize="xl" fontWeight="500" color="white">
            {averageUnlockTimeValue} Days
          </Box>
        </VStack>
      </SimpleGrid>
    </>
  );

  const renderData = (): ReactNode => (
    <>
      <StyledTitleBox>Last week's stats</StyledTitleBox>

      <StyledDataBox isteal="true">
        <StyledLabel>{t(aprLabel)}</StyledLabel>
        <StyledValue primary="true">{aprValue}%</StyledValue>
      </StyledDataBox>
      <StyledDataBox>
        <StyledLabel>{t(totalDistributionLabel)}</StyledLabel>
        <StyledValue>{totalDistributionValue} SPIRIT</StyledValue>
        <StyledSubText>{`${totalDistributionUSD}`}</StyledSubText>
      </StyledDataBox>
      <StyledDataBox>
        <StyledLabel>{t(nextDistributionLabel)}</StyledLabel>
        <StyledValue>
          <DateTime
            ISODateTime={nextDistributionValue}
            locale="en-GB"
            options={{
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }}
          />
        </StyledValue>
      </StyledDataBox>
      <StyledDataBox>
        <StyledLabel>{t(spiritPerInspiritLabel)}</StyledLabel>
        <StyledValue>{spiritPerInspiritValue}</StyledValue>
      </StyledDataBox>
    </>
  );

  return (
    <StyledPanel>
      {renderHeader()}
      {renderData()}
    </StyledPanel>
  );
};

export default Stats;
