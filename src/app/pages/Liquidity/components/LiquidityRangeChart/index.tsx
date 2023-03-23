import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { Chart } from 'app/components/Chart';
import { useInfoTickData } from 'app/hooks/v3/usePoolTickData';
import JSBI from 'jsbi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInitialTokenPrice } from 'store/v3/mint/hooks';
import {
  Currency,
  CurrencyAmount,
  Price,
  TickMath,
  Token,
} from '../../../../../v3-sdk';

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
        borderColor: '#8498B9',
        backgroundColor: '#8498B9',
        minBarLength: 10,
      },
    ],
  },
};

export function LiquidityRangeChart({
  currencyA,
  currencyB,
  price,
  priceLower,
  priceUpper,
}: {
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
  price: any;
  priceLower: Price<Token, Token> | undefined;
  priceUpper: Price<Token, Token> | undefined;
}) {
  const {
    fetchTicksSurroundingPrice: {
      ticksLoading,
      ticksResult,
      fetchTicksSurroundingPrice,
    },
  } = useInfoTickData();

  const [processedData, setProcessedData] = useState<any[] | null>(null);

  useEffect(() => {
    if (!currencyA || !currencyB) return;
    fetchTicksSurroundingPrice(currencyA, currencyB);
  }, [currencyA, currencyB]);

  useEffect(() => {
    if (!ticksResult || !ticksResult.ticksProcessed) return;

    async function processTicks() {
      const _data = await Promise.all(
        ticksResult.ticksProcessed.map(async (t: any, i: number) => {
          const active = t.tickIdx === ticksResult.activeTickIdx;

          return {
            index: i,
            isCurrent: active,
            activeLiquidity: parseFloat(t.liquidityActive.toString()),
            price0: parseFloat(t.price0),
            price1: parseFloat(t.price1),
          };
        }),
      );
      setProcessedData(_data);
    }

    processTicks();
  }, [ticksResult]);

  const formattedData = useMemo(() => {
    if (!processedData) return undefined;
    if (processedData && processedData.length === 0) return undefined;

    const ZOOM = 5;

    const middle = Math.round(processedData.length / 2);
    const chunkLength = Math.round(processedData.length / ZOOM);

    return processedData.slice(middle - chunkLength, middle + chunkLength);
  }, [processedData]);

  const activeTickIdx = useMemo(() => {
    if (!formattedData) return;

    let idx;

    for (let i = 0; i < formattedData.length; i++) {
      if (formattedData[i].isCurrent) {
        idx = i;
      }
    }

    return idx;
  }, [formattedData]);

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

    if (!formattedData) {
      data = [];
    } else {
      data = formattedData;
    }

    if (isSorted) {
      return [data?.map(d => d.price0), data.map(d => d.activeLiquidity)];
    } else {
      return [
        data?.map(d => d.price1).reverse(),
        data.map(d => d.activeLiquidity),
      ];
    }
  }, [formattedData, price, initialPrice, isSorted]);

  const brush = useMemo(() => {
    if (!labels) return '#8498B9';

    let left, right;

    if (leftPrice && rightPrice) {
      left = leftPrice.toSignificant(18);
      right = rightPrice.toSignificant(18);
    }

    return labels.map((value, index) => {
      if (index === activeTickIdx) {
        return 'yellow';
      }

      if (!left || !right) return '#8498B9';

      if (Number(value) >= Number(left) && Number(value) <= Number(right)) {
        return '#60E6C5';
      }

      return '#8498B9';
    });
  }, [price, labels, leftPrice, rightPrice, isSorted]);

  const dataset = useMemo(() => {
    dataOptions.Bar.datasets[0].backgroundColor = brush;
    return dataOptions;
  }, [brush]);

  return formattedData ? (
    <>
      <Chart
        type={'Bar'}
        durationLabels={labels}
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
          <Box w="10px" h="10px" bg="#60E6C5" borderRadius="50%" mr={4}></Box>
          <Text>Selected range</Text>
        </Flex>
        <Flex alignItems="center">
          <Box w="10px" h="10px" bg="#8498B9" borderRadius="50%" mr={4}></Box>
          <Text>Liquidity</Text>
        </Flex>
      </HStack>
    </>
  ) : null;
}
