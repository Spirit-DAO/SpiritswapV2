import { nearestUsableTick, TickMath } from '../../../v3-sdk';
import { useMemo } from 'react';
import { Bound } from 'store/v3/mint/actions';

export default function useIsTickAtLimit(
  tickLower: number | undefined,
  tickUpper: number | undefined,
) {
  return useMemo(
    () => ({
      [Bound.LOWER]: tickLower
        ? // ? tickLower === nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount as FeeAmount])
          tickLower === nearestUsableTick(TickMath.MIN_TICK, 60)
        : undefined,
      [Bound.UPPER]: tickUpper
        ? // ? tickUpper === nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount as FeeAmount])
          tickUpper === nearestUsableTick(TickMath.MAX_TICK, 60)
        : undefined,
    }),
    [tickLower, tickUpper],
  );
}
