import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { Chart } from 'app/components/Chart';
import { usePoolActiveLiquidity } from 'app/hooks/v3/usePoolTickData';
import { useCallback, useEffect, useMemo } from 'react';
import { useInitialTokenPrice } from 'store/v3/mint/hooks';

export const liquidityChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  categoryPercentage: 1.0,
  barPercentage: 1.0,
  animation: {
    duration: 0,
  },
  events: null,
  plugins: {
    tooltip: {
      enabled: false,
    },
    legend: {
      display: false,
      position: 'top' as const,
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: false,
        },
        speed: 100,
      },
      pan: {
        enabled: false,
        speed: 100,
      },
    },
  },
  scales: {
    x: {
      offset: true,
      ticks: {
        display: false,
      },
      grid: {
        display: false,
        drawBorder: false,
      },
    },
    y: {
      ticks: {
        display: false,
      },
      min: 1,
      grid: {
        display: false,
        drawBorder: false,
      },
    },
  },
};

export const dataOptions: any = {
  Bar: {
    datasets: [
      {
        label: '',
        borderColor: '#60E6C5',
        backgroundColor: '#60E6C5',
        minBarLength: 10,
      },
    ],
  },
};

export function LiquidityRangeChart({
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
  price,
  priceLower,
  priceUpper,
}) {
  const { isLoading, isUninitialized, isError, error, data } =
    usePoolActiveLiquidity(currencyA, currencyB, feeAmount);

  const formattedData = useMemo(() => {
    if (!data?.length) {
      return undefined;
    }

    const newData: any[] = [];

    for (let i = 0; i < data.length; i++) {
      const t: any = data[i];

      const formattedPrice = parseFloat(t.price0);

      const chartEntry = {
        activeLiquidity: parseFloat(t.liquidityActive.toString()),
        price0: formattedPrice,
      };

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry);
      }
    }

    return newData;
  }, [data]);

  const initialPrice = useInitialTokenPrice();

  const isSorted =
    currencyA &&
    currencyB &&
    currencyA?.wrapped.sortsBefore(currencyB?.wrapped);

  const leftPrice = useMemo(() => {
    return isSorted ? priceLower : priceUpper?.invert();
  }, [isSorted, priceLower, priceUpper]);

  const rightPrice = useMemo(() => {
    return isSorted ? priceUpper : priceLower?.invert();
  }, [isSorted, priceLower, priceUpper]);

  const [labels, values] = useMemo(() => {
    let data;

    if (!formattedData || !price) {
      data = [{ price0: +initialPrice, activeLiquidity: 0 }];
    } else {
      data = formattedData;
    }

    const CHART_TICKS = 100;
    const TICK_STEP = price * 0.07;

    let additionalTicks = Math.round((CHART_TICKS - data.length) / 2);
    let firstValue = data[0].price0;
    let lastValue = data[data.length - 1].price0;

    let ticksBefore: any[] = [];
    let ticksAfter: any[] = [];

    for (let i = additionalTicks; i >= 0; i--) {
      firstValue = firstValue - TICK_STEP;
      ticksBefore.push({
        price0: firstValue,
        activeLiquidity: 0,
      });
    }

    for (let i = 0; i <= additionalTicks; i++) {
      lastValue = lastValue + TICK_STEP;
      ticksAfter.push({
        price0: lastValue,
        activeLiquidity: 0,
      });
    }

    const ticksData = ticksBefore
      .reverse()
      .concat(data)
      .concat(ticksAfter)
      .filter(v => v.price0 > 0);

    let closestToPrice = ticksData[0];
    let closestToPriceIdx = 0;

    for (let i = 1; i < ticksData.length; i++) {
      if (closestToPrice.price0 <= price) {
        closestToPrice = ticksData[i];
        closestToPriceIdx = i;
      } else {
        break;
      }
    }

    ticksData[closestToPriceIdx].activeLiquidity = 100_000_000;
    ticksData[closestToPriceIdx].activePrice = true;

    return [
      ticksData?.map(d => ({ price: d.price0, activePrice: d.activePrice })),
      ticksData.map(d => d.activeLiquidity),
    ];
  }, [formattedData, price, initialPrice]);

  const brush = useMemo(() => {
    if (!labels) return '#60E6C5';

    let left, right;

    if (leftPrice && rightPrice) {
      left = leftPrice.toSignificant(4);
      right = rightPrice.toSignificant(4);
    }

    return labels.map(value => {
      if (value.activePrice) {
        return 'yellow';
      }

      if (!left || !right) return '#60E6C5';

      if (
        Number(value.price) >= Number(left) &&
        Number(value.price) <= Number(right)
      ) {
        return '#486bf7';
      }

      return '#60E6C5';
    });
  }, [price, labels, leftPrice, rightPrice]);

  const dataset = useMemo(() => {
    dataOptions.Bar.datasets[0].backgroundColor = brush;
    return dataOptions;
  }, [brush]);

  return (
    <>
      <Chart
        type={'Bar'}
        durationLabels={labels.map(v => v.price)}
        data={values}
        customChartDataset={dataset}
        customChartOptions={liquidityChartOptions}
      />
      <HStack gap={2} p={5} justifyContent="center">
        <Flex alignItems="center">
          <Box w="10px" h="10px" bg="yellow" borderRadius="50%" mr={4}></Box>
          <Text>Current price</Text>
        </Flex>
        <Flex alignItems="center">
          <Box w="10px" h="10px" bg="#486bf7" borderRadius="50%" mr={4}></Box>
          <Text>Selected range</Text>
        </Flex>
        <Flex alignItems="center">
          <Box w="10px" h="10px" bg="#60E6C5" borderRadius="50%" mr={4}></Box>
          <Text>Liquidity</Text>
        </Flex>
      </HStack>
    </>
  );
}
