import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Props as StatsProps } from './Stats.d';
import {
  StyledContent,
  StyledDataBox,
  StyledGrid,
  StyledLabel,
  StyledValue,
  StyledSubHeader,
  StyledSelectContainer,
  StyledChartContainer,
  TimeFrameSelect,
} from './styles';

import { DateTime } from 'app/components/DateTime';
import { Chart } from 'app/components/Chart';
import { Flex } from '@chakra-ui/react';
import { CardHeader } from 'app/components/CardHeader';
import { STATS } from 'constants/icons';
import { convertAmount, formatNumber, GetInspiritData } from 'app/utils';

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

const intervals = {
  week: {
    data: [],
    labels: [],
  },
  month: {
    data: [100, 40, 50, 70, 30, 60, 80, 90, 110, 80, 70, 60],
    labels: [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ],
  },
  year: {
    data: [],
    labels: [],
  },
  all: {
    data: [],
    labels: [],
  },
};

const Stats = ({
  dataLabels = defaultTranslations,
  dataValues,
}: StatsProps) => {
  const {
    titleLabel,
    totalSpiritLockedLabel,
    totalDistributionLabel,
    averageUnlockTimeLabel,
    aprLabel,
    spiritPerInspiritLabel,
    nextDistributionLabel,
    selectLabels,
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
    selectedDate: `${new Date(statisticsFromTimestamp)}`,

    totalSpiritLockedUSD: convertAmount(totalLockedUSD),

    totalDistributionUSD: convertAmount(totalDistributionUSDOriginal),

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

    nextDistributionValue: `${new Date(
      parseInt(nextSpiritDistribution, 10) * 1000,
    )}`,
  };

  const {
    selectedDate,
    totalSpiritLockedValue,
    totalDistributionValue,
    averageUnlockTimeValue,
    aprValue,
    spiritPerInspiritValue,
    nextDistributionValue,
  } = statsDataValues;

  const { t } = useTranslation();
  const translationPathHelper = 'inSpirit.modalHelper';

  const labels = selectLabels.map(v => t(v));

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
      <StyledSubHeader>
        <StyledContent direction="column">
          <StyledLabel>{t(totalSpiritLockedLabel)}</StyledLabel>
          <StyledValue size={16}>{totalSpiritLockedValue} SPIRIT</StyledValue>
        </StyledContent>
        <StyledSelectContainer>
          <TimeFrameSelect labels={labels} onChange={() => {}} selected={2} />
        </StyledSelectContainer>
      </StyledSubHeader>
    </>
  );

  const renderBarChart = (): ReactNode => (
    <StyledChartContainer>
      <Chart
        type="Bar"
        data={intervals['month'].data}
        durationLabels={intervals['month'].labels}
      />
    </StyledChartContainer>
  );

  const renderData = (): ReactNode => (
    <StyledGrid>
      <StyledDataBox>
        <StyledValue>
          <DateTime
            ISODateTime={selectedDate}
            locale="en-GB"
            options={{
              month: 'long',
              year: 'numeric',
            }}
          />
        </StyledValue>
      </StyledDataBox>
      <StyledDataBox>
        <StyledLabel>{t(totalSpiritLockedLabel)}</StyledLabel>
        <StyledValue primary>{totalSpiritLockedValue} SPIRIT</StyledValue>
      </StyledDataBox>
      <StyledDataBox>
        <StyledLabel>{t(aprLabel)}</StyledLabel>
        <StyledValue primary>{aprValue}%</StyledValue>
      </StyledDataBox>
      <StyledDataBox>
        <StyledLabel>{t(totalDistributionLabel)}</StyledLabel>
        <StyledValue>{totalDistributionValue} SPIRIT</StyledValue>
      </StyledDataBox>
      <StyledDataBox>
        <StyledLabel>{t(spiritPerInspiritLabel)}</StyledLabel>
        <StyledValue>{spiritPerInspiritValue}</StyledValue>
      </StyledDataBox>
      <StyledDataBox>
        <StyledLabel>{t(averageUnlockTimeLabel)}</StyledLabel>
        <StyledValue>{averageUnlockTimeValue} Days</StyledValue>
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
    </StyledGrid>
  );

  return (
    <Flex direction="column">
      {renderHeader()}
      {renderBarChart()}
      {renderData()}
    </Flex>
  );
};

export default Stats;
