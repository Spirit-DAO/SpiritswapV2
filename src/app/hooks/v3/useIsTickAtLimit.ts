import { nearestUsableTick, TickMath } from '../../../v3-sdk';
import { useMemo } from 'react';
import { Bound } from 'store/v3/mint/actions';

export default function useIsTickAtLimit(
  tickLower: number | undefined,
  tickUpper: number | undefined,
  tickSpacing: number | undefined,
) {
  return useMemo(
    () => ({
      [Bound.LOWER]: tickLower
        ? tickLower === nearestUsableTick(TickMath.MIN_TICK, tickSpacing || 60)
        : undefined,
      [Bound.UPPER]: tickUpper
        ? // ? tickUpper === nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount as FeeAmount])
          tickUpper === nearestUsableTick(TickMath.MAX_TICK, tickSpacing || 60)
        : undefined,
    }),
    [tickLower, tickUpper],
  );
}
