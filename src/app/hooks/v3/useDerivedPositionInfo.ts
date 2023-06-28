import { Pool, Position } from '../../../v3-sdk';
import { usePool } from './usePools';
import { useCurrency } from './useCurrency';

export function useDerivedPositionInfo(positionDetails: any | undefined): {
  position: Position | undefined;
  pool: Pool | undefined;
} {
  const currency0 = useCurrency(positionDetails?.token0);
  const currency1 = useCurrency(positionDetails?.token1);

  // construct pool data
  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined);

  let _position: Position | undefined = undefined;
  if (pool && positionDetails) {
    _position = new Position({
      pool,
      liquidity: positionDetails.liquidity.toString(),
      tickLower: positionDetails.tickLower,
      tickUpper: positionDetails.tickUpper,
    });
  }

  return {
    position: _position,
    pool: pool ?? undefined,
  };
}
