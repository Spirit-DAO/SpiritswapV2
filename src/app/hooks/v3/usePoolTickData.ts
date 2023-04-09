import { useState } from 'react';
import keyBy from 'lodash.keyby';
import {
  Token,
  TickMath,
  tickToPrice,
  computePoolAddress,
  Currency,
} from '../../../v3-sdk';
import JSBI from 'jsbi';
import { getAllV3Ticks, getPool } from 'utils/apollo/queries-v3';
import contracts from 'constants/contracts';

export function useInfoTickData() {
  const numSurroundingTicks = 300;
  const PRICE_FIXED_DIGITS = 8;

  const [ticksResult, setTicksResult] = useState<null | any>(null);
  const [ticksLoading, setTicksLoading] = useState<boolean>(false);

  async function fetchInitializedTicks(
    poolAddress: string,
    tickIdxLowerBound: number,
    tickIdxUpperBound: number,
  ) {
    let surroundingTicks: any[] = [];
    let surroundingTicksResult: any[] = [];

    let skip = 0;
    do {
      const { data, error, loading } = await getAllV3Ticks(
        poolAddress,
        tickIdxLowerBound,
        tickIdxUpperBound,
        skip,
      );

      if (loading) {
        continue;
      }

      if (error) {
        return {
          error: Boolean(error),
          loading,
          ticks: surroundingTicksResult,
        };
      }

      surroundingTicks = data;
      surroundingTicksResult = surroundingTicksResult.concat(surroundingTicks);
      skip += 1000;
    } while (surroundingTicks.length > 0);

    return { ticks: surroundingTicksResult, loading: false, error: false };
  }

  async function fetchTicksSurroundingPrice(
    currencyA: Currency,
    currencyB: Currency,
  ) {
    setTicksLoading(true);

    const poolAddress = computePoolAddress({
      poolDeployer: contracts.v3AlgebraPoolDeployer[250],
      tokenA: currencyA.wrapped,
      tokenB: currencyB.wrapped,
    });

    try {
      const pool = await getPool(poolAddress);

      if (!pool) return;

      const {
        tick: poolCurrentTick,
        tickSpacing: poolTickSpacing,
        liquidity,
        token0: { id: token0Address, decimals: token0Decimals },
        token1: { id: token1Address, decimals: token1Decimals },
      } = pool;

      const poolCurrentTickIdx = parseInt(poolCurrentTick);
      const tickSpacing = Number(poolTickSpacing) || 60;

      const activeTickIdx =
        Math.floor(poolCurrentTickIdx / tickSpacing) * tickSpacing;

      const tickIdxLowerBound =
        activeTickIdx - numSurroundingTicks * tickSpacing;
      const tickIdxUpperBound =
        activeTickIdx + numSurroundingTicks * tickSpacing;

      const initializedTicksResult = await fetchInitializedTicks(
        poolAddress,
        tickIdxLowerBound,
        tickIdxUpperBound,
      );
      if (initializedTicksResult.error || initializedTicksResult.loading) {
        return {
          error: initializedTicksResult.error,
          loading: initializedTicksResult.loading,
        };
      }

      const { ticks: initializedTicks } = initializedTicksResult;

      const tickIdxToInitializedTick = keyBy(initializedTicks, 'tickIdx');

      const token0 = new Token(1, token0Address, parseInt(token0Decimals));
      const token1 = new Token(1, token1Address, parseInt(token1Decimals));

      let activeTickIdxForPrice = activeTickIdx;
      if (activeTickIdxForPrice < TickMath.MIN_TICK) {
        activeTickIdxForPrice = TickMath.MIN_TICK;
      }
      if (activeTickIdxForPrice > TickMath.MAX_TICK) {
        activeTickIdxForPrice = TickMath.MAX_TICK;
      }

      const activeTickProcessed = {
        liquidityActive: JSBI.BigInt(liquidity),
        tickIdx: activeTickIdx,
        liquidityNet: JSBI.BigInt(0),
        price0: tickToPrice(token0, token1, activeTickIdxForPrice).toFixed(
          PRICE_FIXED_DIGITS,
        ),
        price1: tickToPrice(token1, token0, activeTickIdxForPrice).toFixed(
          PRICE_FIXED_DIGITS,
        ),
        liquidityGross: JSBI.BigInt(0),
      };

      const activeTick = tickIdxToInitializedTick[activeTickIdx];
      if (activeTick) {
        activeTickProcessed.liquidityGross = JSBI.BigInt(
          activeTick.liquidityGross,
        );
        activeTickProcessed.liquidityNet = JSBI.BigInt(activeTick.liquidityNet);
      }

      enum Direction {
        ASC,
        DESC,
      }

      // Computes the numSurroundingTicks above or below the active tick.
      const computeSurroundingTicks = (
        activeTickProcessed: any,
        tickSpacing: number,
        numSurroundingTicks: number,
        direction: Direction,
      ) => {
        let previousTickProcessed = {
          ...activeTickProcessed,
        };

        // Iterate outwards (either up or down depending on 'Direction') from the active tick,
        // building active liquidity for every tick.
        let processedTicks: any[] = [];
        for (let i = 0; i < numSurroundingTicks; i++) {
          const currentTickIdx =
            direction == Direction.ASC
              ? previousTickProcessed.tickIdx + tickSpacing
              : previousTickProcessed.tickIdx - tickSpacing;

          if (
            currentTickIdx < TickMath.MIN_TICK ||
            currentTickIdx > TickMath.MAX_TICK
          ) {
            break;
          }

          const currentTickProcessed: any = {
            liquidityActive: previousTickProcessed.liquidityActive,
            tickIdx: currentTickIdx,
            liquidityNet: JSBI.BigInt(0),
            price0: tickToPrice(token0, token1, currentTickIdx).toFixed(
              PRICE_FIXED_DIGITS,
            ),
            price1: tickToPrice(token1, token0, currentTickIdx).toFixed(
              PRICE_FIXED_DIGITS,
            ),
            liquidityGross: JSBI.BigInt(0),
          };

          const currentInitializedTick =
            tickIdxToInitializedTick[currentTickIdx.toString()];
          if (currentInitializedTick) {
            currentTickProcessed.liquidityGross = JSBI.BigInt(
              currentInitializedTick.liquidityGross,
            );
            currentTickProcessed.liquidityNet = JSBI.BigInt(
              currentInitializedTick.liquidityNet,
            );
          }

          if (direction == Direction.ASC && currentInitializedTick) {
            currentTickProcessed.liquidityActive = JSBI.add(
              previousTickProcessed.liquidityActive,
              JSBI.BigInt(currentInitializedTick.liquidityNet),
            );
          } else if (
            direction == Direction.DESC &&
            JSBI.notEqual(previousTickProcessed.liquidityNet, JSBI.BigInt(0))
          ) {
            currentTickProcessed.liquidityActive = JSBI.subtract(
              previousTickProcessed.liquidityActive,
              previousTickProcessed.liquidityNet,
            );
          }

          processedTicks.push(currentTickProcessed);
          previousTickProcessed = currentTickProcessed;
        }

        if (direction == Direction.DESC) {
          processedTicks = processedTicks.reverse();
        }

        return processedTicks;
      };

      const subsequentTicks = computeSurroundingTicks(
        activeTickProcessed,
        tickSpacing,
        numSurroundingTicks,
        Direction.ASC,
      );

      const previousTicks = computeSurroundingTicks(
        activeTickProcessed,
        tickSpacing,
        numSurroundingTicks,
        Direction.DESC,
      );

      const ticksProcessed = previousTicks
        .concat(activeTickProcessed)
        .concat(subsequentTicks);

      setTicksResult({
        ticksProcessed,
        tickSpacing,
        activeTickIdx,
        token0,
        token1,
      });
    } catch (err: any) {
      throw new Error(err);
    } finally {
      setTicksLoading(false);
    }
  }

  return {
    fetchTicksSurroundingPrice: {
      ticksResult,
      ticksLoading,
      fetchTicksSurroundingPrice,
    },
  };
}
