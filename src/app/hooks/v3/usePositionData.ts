import usePrevious from './usePrevious';
import { formatAmount } from 'app/utils';
import { useEffect, useMemo, useState } from 'react';
import { getTokenUsdPrice } from 'utils/data';
import { unwrappedToken } from 'utils/v3/wrappedCurrency';
import { Position } from '../../../v3-sdk';
import { useTokenV3 } from './useCurrency';
import { usePool } from './usePools';
import { useV3PositionFees } from './useV3PositionFees';
import useIsTickAtLimit from './useIsTickAtLimit';

export function usePositionData(
  positionDetails: any,
  updateRates?: (rate) => void,
  updateFees?: (fees) => void,
) {
  const [usdAmount, setUsdAmount] = useState<number | undefined>(0);
  const [feesAmount, setFeesAmount] = useState<number | undefined>(0);

  const prevPositionDetails = usePrevious({ ...positionDetails });
  const {
    token0: _token0Address,
    token1: _token1Address,
    liquidity: _liquidity,
    tickLower: _tickLower,
    tickUpper: _tickUpper,
    onFarmingCenter: _onFarming,
  } = useMemo(() => {
    if (
      !positionDetails &&
      prevPositionDetails &&
      prevPositionDetails.liquidity
    ) {
      return { ...prevPositionDetails };
    }
    return { ...positionDetails };
  }, [positionDetails]);

  const token0 = useTokenV3(_token0Address);
  const token1 = useTokenV3(_token1Address);

  const currency0 = token0 ? unwrappedToken(token0) : undefined;
  const currency1 = token1 ? unwrappedToken(token1) : undefined;

  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined);

  const prevPool = usePrevious(pool);
  const _pool = useMemo(() => {
    if (!pool && prevPool) {
      return prevPool;
    }
    return pool;
  }, [pool]);

  const position = useMemo(() => {
    if (_pool) {
      return new Position({
        pool: _pool,
        liquidity: _liquidity._hex,
        tickLower: _tickLower,
        tickUpper: _tickUpper,
      });
    }
    return undefined;
  }, [_liquidity, _pool, _tickLower, _tickUpper]);

  const outOfRange: boolean = _pool
    ? _pool.tickCurrent < _tickLower || _pool.tickCurrent >= _tickUpper
    : false;

  const [amount0, amount1] = useMemo(() => {
    if (!position || !token0 || !token1) return [0, 0];

    const amount0 = position.amount0.toSignificant(token0.decimals);
    const amount1 = position.amount1.toSignificant(token1.decimals);

    return [amount0, amount1];
  }, [position, token0, token1]);

  const [amount0String, amount1String] = useMemo(() => {
    if (!amount0 || !amount1 || !token0 || !token1) return ['', ''];

    return [
      `${formatAmount(String(amount0), 3)} ${token0.symbol}`,
      `${formatAmount(String(amount1), 3)} ${token1.symbol}`,
    ];
  }, [amount0, amount1, token0, token1]);

  const [feeValue0, feeValue1] = useV3PositionFees(
    _pool ?? undefined,
    positionDetails?.tokenId,
    false,
  );

  useEffect(() => {
    if (!token0 || !token1 || !amount0 || !amount1) return;

    Promise.all([
      getTokenUsdPrice(token0.wrapped.address),
      getTokenUsdPrice(token1.wrapped.address),
    ]).then(rates => {
      if (rates) {
        const sum = rates[0] * Number(amount0) + rates[1] * Number(amount1);

        const fees0 = feeValue0 ? Number(feeValue0?.toSignificant(4)) : 0;
        const fees1 = feeValue1 ? Number(feeValue1?.toSignificant(4)) : 0;

        const feesSum = rates[0] * fees0 + rates[1] * fees1;

        setUsdAmount(sum);
        setFeesAmount(feesSum);

        if (updateRates) {
          updateRates(sum);
        }

        if (updateFees) {
          updateFees(feesSum);
        }
      } else {
        setUsdAmount(0);
        setFeesAmount(0);
        if (updateRates) {
          updateRates(0);
        }

        if (updateFees) {
          updateFees(0);
        }
      }
    });
  }, [token0, token1, amount0, amount1, feeValue0, feeValue1]);

  const tickAtLimit = useIsTickAtLimit(
    _tickLower,
    _tickUpper,
    _pool?.tickSpacing,
  );

  const isFullRange = tickAtLimit.LOWER && tickAtLimit.UPPER;

  const isRemoved = Number(_liquidity?._hex) === 0;

  return useMemo(() => {
    return {
      usdAmount,
      feesAmount,
      outOfRange,
      amount0,
      amount1,
      amount0String,
      amount1String,
      token0,
      token1,
      pool,
      feeValue0,
      feeValue1,
      tickAtLimit,
      isRemoved,
      isFullRange,
    };
  }, [
    usdAmount,
    feesAmount,
    outOfRange,
    amount0,
    amount1,
    amount0String,
    amount1String,
    token0,
    token1,
    pool,
    feeValue0,
    feeValue1,
    tickAtLimit,
    isRemoved,
    isFullRange,
  ]);
}
