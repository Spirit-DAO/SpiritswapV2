import { Currency, CurrencyAmount, Percent, Position } from '../../../v3-sdk';
import { usePool } from 'app/hooks/v3/usePools';
import { useToken } from 'app/hooks/useToken';
import { useV3PositionFees } from 'app/hooks/v3/useV3PositionFees';
import { useCallback, useMemo } from 'react';
import { selectPercent } from './actions';
import { unwrappedToken } from 'utils/v3/wrappedCurrency';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useWallets from 'app/hooks/useWallets';
import { RootState } from 'store';
import { CHAIN_ID } from 'constants/index';
import { BigNumber } from 'ethers';
import { useCurrency } from 'app/hooks/v3/useCurrency';

export interface PositionPool {
  fee: undefined | string;
  feeGrowthInside0LastX128: BigNumber;
  feeGrowthInside1LastX128: BigNumber;
  liquidity: BigNumber;
  nonce: BigNumber;
  operator: string;
  tickLower: number;
  tickUpper: number;
  token0: string;
  token1: string;
  tokenId: BigNumber;
  tokensOwed0: BigNumber;
  tokensOwed1: BigNumber;
  onFarmingCenter: boolean;
}

export function useBurnV3State(): RootState['burnV3'] {
  return useAppSelector(state => state.burnV3);
}

export function useDerivedV3BurnInfo(
  position?: PositionPool,
  asWETH = false,
): {
  position?: Position;
  liquidityPercentage?: Percent;
  liquidityValue0?: CurrencyAmount<Currency>;
  liquidityValue1?: CurrencyAmount<Currency>;
  feeValue0?: CurrencyAmount<Currency>;
  feeValue1?: CurrencyAmount<Currency>;
  outOfRange: boolean;
  error?: string;
} {
  const { account } = useWallets();
  const { percent } = useBurnV3State();

  //   const token0 = useToken(CHAIN_ID, position ? position.token0 : '');
  //   const token1 = useToken(CHAIN_ID, position ? position?.token1 : '');

  const currency0 = useCurrency(position?.token0);
  const currency1 = useCurrency(position?.token1);

  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined);

  const positionSDK = useMemo(
    () =>
      pool &&
      position?.liquidity &&
      typeof position?.tickLower === 'number' &&
      typeof position?.tickUpper === 'number'
        ? new Position({
            pool,
            liquidity: position.liquidity._hex,
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
          })
        : undefined,
    [pool, position],
  );

  const liquidityPercentage = new Percent(percent, 100);

  const discountedAmount0 = positionSDK
    ? liquidityPercentage.multiply(positionSDK.amount0.quotient).quotient
    : undefined;
  const discountedAmount1 = positionSDK
    ? liquidityPercentage.multiply(positionSDK.amount1.quotient).quotient
    : undefined;

  const liquidityValue0 =
    currency0 && discountedAmount0
      ? CurrencyAmount.fromRawAmount(
          asWETH ? currency0 : unwrappedToken(currency0),
          discountedAmount0,
        )
      : undefined;
  const liquidityValue1 =
    currency1 && discountedAmount1
      ? CurrencyAmount.fromRawAmount(
          asWETH ? currency1 : unwrappedToken(currency1),
          discountedAmount1,
        )
      : undefined;

  const [feeValue0, feeValue1] = useV3PositionFees(
    pool ?? undefined,
    position?.tokenId,
    asWETH,
  );

  const outOfRange =
    pool && position
      ? pool.tickCurrent < position.tickLower ||
        pool.tickCurrent > position.tickUpper
      : false;

  let error: string | undefined;
  if (!account) {
    error = `Connect Wallet`;
  }
  if (percent === 0) {
    error = error ?? `Enter a percent`;
  }
  return {
    position: positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0,
    feeValue1,
    outOfRange,
    error,
  };
}

export function useBurnV3ActionHandlers(): {
  onPercentSelect: (percent: number) => void;
} {
  const dispatch = useAppDispatch();

  const onPercentSelect = useCallback(
    (percent: number) => {
      dispatch(selectPercent({ percent }));
    },
    [dispatch],
  );

  return {
    onPercentSelect,
  };
}
