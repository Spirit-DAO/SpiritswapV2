import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heading } from 'app/components/Typography';
import { PercentBadge } from 'app/components/PercentBadge';
import { Chart } from 'app/components/Chart';
import { CHART_STYLE, getSign } from 'app/utils';
import { GridItem, SimpleGrid, Skeleton, Image } from '@chakra-ui/react';
import { ReactComponent as BarChart } from 'app/assets/images/chart-bar.svg';
import { ReactComponent as LineChart } from 'app/assets/images/chart-line.svg';
import { TokensPanel } from 'app/pages/Portfolio/components/TokensPanel';
import { LiquidityPanel } from 'app/pages/Portfolio/components/LiquidityPanel';
import { InSpiritPanel } from '../../Portfolio/components/inSpiritPanel';
import { inSpiritData as inSpiritDataInterface } from '../../Portfolio/components/inSpiritPanel';
import {
  PortfolioWrapper,
  PortfolioTopWrapper,
  PortfolioHeaderWrapper,
  PortfolioHeader1Wrapper,
  PortfolioSelectorWrapper,
  PortfolioPriceWrapper,
  PortfolioChartStyleSelect,
} from './styles';
import { balanceReturnData } from 'utils/data';
import { SPIRIT } from 'constants/tokens';
import { LendAndBorrowPanel } from 'app/pages/Portfolio/components/LendAndBorrowPanel';
import { ChartStyles } from 'app/components/Chart/Chart.d';
import { GelattoLimitOrder } from 'utils/swap/types';
import useMobile from 'utils/isMobile';
import portfolioBackground from '../assets/portfolio.png';
import { useTokenBalance } from 'app/hooks/useTokenBalance';
import { CHAIN_ID } from 'constants/index';
import { useAppSelector } from 'store/hooks';
import { selectHistoricalPortfolioValue } from 'store/user/selectors';
import { FadeInAnimationBox } from 'app/components/FadeInAnimationBox';
import LimitOrdersPanelV2 from 'app/pages/Portfolio/components/LimitOrderPanelV2/LimitOrdersPanelV2';
import { useSelector } from 'react-redux';
import { selectLpPrices } from 'store/general/selectors';

interface PortfolioProps {
  translationPath: string;
  amount: string;
  tokensData: balanceReturnData;
  inSpiritData: inSpiritDataInterface;
  liquidityData: balanceReturnData;
  limitOrdersData: GelattoLimitOrder[];
  onClickLandingButton?: () => void;
}

const chartStylesSelectIcons = [<BarChart />, <LineChart />];

const Portfolio = ({
  translationPath,
  amount,
  tokensData,
  inSpiritData,
  liquidityData,
  limitOrdersData,
}: PortfolioProps) => {
  const { t } = useTranslation();
  const isMobile = useMobile();

  const chartDataObject = useAppSelector(selectHistoricalPortfolioValue);
  const chartData = JSON.parse(
    JSON.stringify(chartDataObject.valuesArray ?? []),
  );
  const chartDates = JSON.parse(
    JSON.stringify(chartDataObject.datesArray ?? []),
  );

  const [selectedChartStyle, setSelectedChartStyle] = useState<{
    name: string;
    ID: number;
  }>({
    name: CHART_STYLE.LINES.name,
    ID: CHART_STYLE.LINES.ID,
  });

  const updateSelectedChartStyle = (item: { index: number; value: string }) => {
    const isBarsChart = item.index === 0;
    setSelectedChartStyle({
      name: isBarsChart ? CHART_STYLE.BARS.name : CHART_STYLE.LINES.name,
      ID: item.index,
    });
  };

  const { token: spiritTokenData } = useTokenBalance(
    CHAIN_ID,
    SPIRIT.address,
    'token',
  );

  return (
    <PortfolioWrapper>
      {!isMobile ? (
        <FadeInAnimationBox position="relative" w="350px">
          <Image
            style={{ pointerEvents: 'none' }}
            src={portfolioBackground}
            position="absolute"
            right="350px"
            top="155px"
            opacity="25%"
          />
        </FadeInAnimationBox>
      ) : null}

      <PortfolioTopWrapper>
        <PortfolioHeaderWrapper>
          <PortfolioHeader1Wrapper>
            <Heading level={2}>{t(`${translationPath}.title`)}</Heading>
            <PortfolioPriceWrapper>
              <Heading level={isMobile ? 4 : 1}>{amount}</Heading>
              <PercentBadge
                amount={tokensData.diffPercent ?? 0}
                sign={getSign(tokensData.diffPercent ?? 0)}
              />
            </PortfolioPriceWrapper>
          </PortfolioHeader1Wrapper>

          <PortfolioSelectorWrapper>
            <PortfolioChartStyleSelect
              labels={chartStylesSelectIcons}
              selected={selectedChartStyle.ID}
              onChange={updateSelectedChartStyle}
            />
          </PortfolioSelectorWrapper>
        </PortfolioHeaderWrapper>
        <Skeleton
          isLoaded={!!chartData.length && !!chartDates.length}
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          h="220px"
          w="auto"
        >
          <Chart
            type={selectedChartStyle.name as ChartStyles}
            durationLabels={chartDates}
            data={chartData}
          />
        </Skeleton>
      </PortfolioTopWrapper>

      <SimpleGrid
        minChildWidth={{ base: '100%', sm: '335px' }}
        columnGap="spacing04"
      >
        <GridItem>
          <TokensPanel tokensData={tokensData} />
          <InSpiritPanel
            spiritData={spiritTokenData}
            inSpiritData={inSpiritData}
          />
          <LendAndBorrowPanel />
        </GridItem>

        <GridItem>
          <LiquidityPanel liquidityData={liquidityData} />
          <LimitOrdersPanelV2 limitOrders={limitOrdersData} />
        </GridItem>
      </SimpleGrid>
    </PortfolioWrapper>
  );
};

export default Portfolio;
