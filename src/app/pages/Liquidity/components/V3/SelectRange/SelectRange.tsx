import { RangeSelector } from 'app/components/RangeSelector';
import { Currency } from '../../../../../../v3-sdk';
import { Bound, updateSelectedPreset } from 'store/v3/mint/actions';
import {
  IDerivedMintInfo,
  useRangeHopCallbacks,
  useV3MintActionHandlers,
  useV3MintState,
} from 'store/v3/mint/hooks';
import { useCallback, useMemo } from 'react';
import { useAppDispatch } from 'store/hooks';
import { useActivePreset } from 'store/v3/mint/hooks';
import { Presets } from 'store/v3/mint';
import { USDC, USDT, DAI } from 'constants/tokens';
import { RangePresets } from 'app/components/RangePresets';
import { LiquidityRangeChart } from '../../LiquidityRangeChart';
import { Box } from '@chakra-ui/react';
import { StyledErrorNotification, StyledWarningNotification } from './styled';

interface IRangeSelector {
  currencyA: Currency | null | undefined;
  currencyB: Currency | null | undefined;
  mintInfo: IDerivedMintInfo;
  isCompleted: boolean;
  additionalStep: boolean;
  disabled: boolean;
  backStep: number;
}

export function SelectRange({
  currencyA,
  currencyB,
  mintInfo,
  isCompleted,
  additionalStep,
  backStep,
  disabled,
}: IRangeSelector) {
  const { startPriceTypedValue } = useV3MintState();

  const dispatch = useAppDispatch();
  const activePreset = useActivePreset();

  const isStablecoinPair = useMemo(() => {
    if (!currencyA || !currencyB) return false;

    const stablecoins = [USDC.address, USDT.address, DAI.address];

    return (
      stablecoins.includes(currencyA.wrapped.address.toLowerCase()) &&
      stablecoins.includes(currencyB.wrapped.address.toLowerCase())
    );
  }, [currencyA, currencyB]);

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = useMemo(() => {
    return mintInfo.ticks;
  }, [mintInfo]);

  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } =
    useMemo(() => {
      return mintInfo.pricesAtTicks;
    }, [mintInfo]);

  const {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    getSetFullRange,
  } = useRangeHopCallbacks(
    currencyA ?? undefined,
    currencyB ?? undefined,
    mintInfo.tickSpacing,
    tickLower,
    tickUpper,
    mintInfo.pool,
  );

  const { onLeftRangeInput, onRightRangeInput } = useV3MintActionHandlers(
    mintInfo.noLiquidity,
  );

  const tokenA = (currencyA ?? undefined)?.wrapped;
  const tokenB = (currencyB ?? undefined)?.wrapped;

  const isSorted = useMemo(() => {
    return tokenA && tokenB && tokenA.sortsBefore(tokenB);
  }, [tokenA, tokenB, mintInfo]);

  const leftPrice = useMemo(() => {
    return isSorted ? priceLower : priceUpper?.invert();
  }, [isSorted, priceLower, priceUpper, mintInfo]);

  const rightPrice = useMemo(() => {
    return isSorted ? priceUpper : priceLower?.invert();
  }, [isSorted, priceUpper, priceLower, mintInfo]);

  const price = useMemo(() => {
    if (!mintInfo.price) return;

    return mintInfo.invertPrice
      ? mintInfo.price.invert().toSignificant(5)
      : mintInfo.price.toSignificant(5);
  }, [mintInfo]);

  const isBeforePrice = useMemo(() => {
    if (!price || !leftPrice || !rightPrice) return false;

    return mintInfo.outOfRange && price > rightPrice.toSignificant(5);
  }, [price, leftPrice, rightPrice, mintInfo]);

  const isAfterPrice = useMemo(() => {
    if (!price || !leftPrice || !rightPrice) return false;

    return mintInfo.outOfRange && price < leftPrice.toSignificant(5);
  }, [price, leftPrice, rightPrice, mintInfo]);

  const handlePresetRangeSelection = useCallback(
    (preset: any | null) => {
      if (!price) return;

      dispatch(updateSelectedPreset({ preset: preset ? preset.type : null }));

      if (preset && preset.type === Presets.FULL) {
        getSetFullRange();
      } else {
        onLeftRangeInput(preset ? String(+price * preset.min) : '');
        onRightRangeInput(preset ? String(+price * preset.max) : '');
      }
    },
    [price],
  );
  return (
    <Box className="f c">
      <div className="f mxs_fd-cr ms_fd-cr">
        <div className="f c">
          <div className="mb-1">
            <RangeSelector
              priceLower={priceLower}
              priceUpper={priceUpper}
              getDecrementLower={getDecrementLower}
              getIncrementLower={getIncrementLower}
              getDecrementUpper={getDecrementUpper}
              getIncrementUpper={getIncrementUpper}
              onLeftRangeInput={onLeftRangeInput}
              onRightRangeInput={onRightRangeInput}
              currencyA={currencyA}
              currencyB={currencyB}
              mintInfo={mintInfo}
              initial={!!mintInfo.noLiquidity}
              disabled={!startPriceTypedValue && !mintInfo.price}
              isBeforePrice={isBeforePrice}
              isAfterPrice={isAfterPrice}
            />
          </div>
          <Box my={4} className="ml-2 mxs_ml-0 ms_ml-0">
            <RangePresets
              isInvalid={mintInfo.invalidRange}
              outOfRange={mintInfo.outOfRange}
              isStablecoinPair={isStablecoinPair}
              activePreset={activePreset}
              handlePresetRangeSelection={handlePresetRangeSelection}
              priceLower={leftPrice?.toSignificant(5)}
              priceUpper={rightPrice?.toSignificant(5)}
              price={price}
            />
          </Box>
          <Box bg="bgBoxLighter" borderRadius="6px">
            <LiquidityRangeChart
              currencyA={currencyA ?? undefined}
              currencyB={currencyB ?? undefined}
              price={price ? parseFloat(price) : undefined}
              priceLower={priceLower}
              priceUpper={priceUpper}
            />
            {mintInfo.outOfRange && (
              <StyledWarningNotification>
                Out of range
              </StyledWarningNotification>
            )}
            {mintInfo.invalidRange && (
              <StyledErrorNotification>Invalid range</StyledErrorNotification>
            )}
          </Box>
        </div>
      </div>
    </Box>
  );
}
