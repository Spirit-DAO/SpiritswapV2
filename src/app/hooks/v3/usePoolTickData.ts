import { Currency, FeeAmount, Pool, tickToPrice } from '../../../v3-sdk';
import computeSurroundingTicks from '../../../v3-sdk/utils/computeSurroundingTicks';

import JSBI from 'jsbi';
import { PoolState, usePool } from './usePools';
import { useEffect, useMemo, useState } from 'react';
import { getAllV3Ticks } from 'utils/apollo/queries-v3';

// TODO
// import { useAllV3TicksQuery } from '../../services/graph/hooks/v3';

const PRICE_FIXED_DIGITS = 8;

// Tick with fields parsed to JSBIs, and active liquidity computed.
export interface TickProcessed {
  tickIdx: number;
  liquidityActive: JSBI;
  liquidityNet: JSBI;
  price0: string;
}

const getActiveTick = (
  tickCurrent: number | undefined,
  feeAmount: FeeAmount | undefined,
) => (tickCurrent && feeAmount ? Math.floor(tickCurrent / 60) * 60 : undefined);

// Fetches all ticks for a given pool
export function useAllV3Ticks(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined,
) {
  const poolAddress =
    currencyA && currencyB && feeAmount
      ? Pool.getAddress(currencyA?.wrapped, currencyB?.wrapped, feeAmount)
      : undefined;

  const [ticksData, setTicksData] = useState<{
    data: any;
    error: any;
    loading: boolean;
  }>({
    data: undefined,
    error: undefined,
    loading: false,
  });

  useEffect(() => {
    if (!poolAddress) return;

    async function fetchTickData() {
      if (!poolAddress) return;
      getAllV3Ticks(poolAddress).then(ticks => {
        setTicksData(ticks);
      });
    }

    fetchTickData();
  }, [poolAddress]);

  return {
    isLoading: ticksData?.loading,
    isUninitialized: false,
    isError: Boolean(ticksData?.error),
    error: ticksData?.error,
    ticks: ticksData?.data,
  };
}

export function usePoolActiveLiquidity(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined,
): {
  isLoading: boolean;
  isUninitialized: boolean;
  isError: boolean;
  error: any;
  activeTick: number | undefined;
  data: TickProcessed[] | undefined;
} {
  const pool = usePool(currencyA, currencyB);

  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick = useMemo(
    () => getActiveTick(pool[1]?.tickCurrent, feeAmount),
    [pool, feeAmount],
  );

  const { isLoading, isUninitialized, isError, error, ticks } = useAllV3Ticks(
    currencyA,
    currencyB,
    feeAmount,
  );

  return useMemo(() => {
    if (
      !currencyA ||
      !currencyB ||
      activeTick === undefined ||
      pool[0] !== PoolState.EXISTS ||
      !ticks ||
      ticks.length === 0 ||
      isLoading ||
      isUninitialized
    ) {
      return {
        isLoading: isLoading || pool[0] === PoolState.LOADING,
        isUninitialized,
        isError,
        error,
        activeTick,
        data: undefined,
      };
    }

    const token0 = currencyA?.wrapped;
    const token1 = currencyB?.wrapped;

    // find where the active tick would be to partition the array
    // if the active tick is initialized, the pivot will be an element
    // if not, take the previous tick as pivot
    const pivot = ticks.findIndex(({ tickIdx }) => tickIdx > activeTick) - 1;

    if (pivot < 0) {
      // consider setting a local error
      console.error('TickData pivot not found');
      return {
        isLoading,
        isUninitialized,
        isError,
        error,
        activeTick,
        data: undefined,
      };
    }

    const activeTickProcessed: TickProcessed = {
      liquidityActive: JSBI.BigInt(pool[1]?.liquidity ?? 0),
      tickIdx: activeTick,
      liquidityNet:
        Number(ticks[pivot].tickIdx) === activeTick
          ? JSBI.BigInt(ticks[pivot].liquidityNet)
          : JSBI.BigInt(0),
      price0: tickToPrice(token0, token1, activeTick).toFixed(
        PRICE_FIXED_DIGITS,
      ),
    };

    const subsequentTicks = computeSurroundingTicks(
      token0,
      token1,
      activeTickProcessed,
      ticks,
      pivot,
      true,
    );

    const previousTicks = computeSurroundingTicks(
      token0,
      token1,
      activeTickProcessed,
      ticks,
      pivot,
      false,
    );

    const ticksProcessed = previousTicks
      .concat(activeTickProcessed)
      .concat(subsequentTicks);

    return {
      isLoading,
      isUninitialized,
      isError: isError,
      error,
      activeTick,
      data: ticksProcessed,
    };
  }, [
    currencyA,
    currencyB,
    activeTick,
    pool,
    ticks,
    isLoading,
    isUninitialized,
    isError,
    error,
  ]);
}
