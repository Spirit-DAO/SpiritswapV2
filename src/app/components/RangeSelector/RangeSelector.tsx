import { Bound } from 'store/v3/mint/actions';

import { RangeSelectorPart } from '../RangeSelectorPart';

import type { Props } from './RangeSelector.d';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridItem, Skeleton } from '@chakra-ui/react';
import { Heading } from '../Typography';
import { StyledCurrentPrice, StyledCurrentPriceWrapper } from './styled';

export default function RangeSelector({
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  getDecrementLower,
  getIncrementLower,
  getDecrementUpper,
  getIncrementUpper,
  currencyA,
  currencyB,
  initial,
  disabled,
  isBeforePrice,
  isAfterPrice,
  mintInfo,
}: Props) {
  const { t } = useTranslation();

  const tokenA = (currencyA ?? undefined)?.wrapped;
  const tokenB = (currencyB ?? undefined)?.wrapped;

  // TODO
  //   const initialTokenPrice = useInitialTokenPrice();
  const initialTokenPrice = 11;

  const isSorted = useMemo(() => {
    return tokenA && tokenB && tokenA.sortsBefore(tokenB);
  }, [tokenA, tokenB]);

  const leftPrice = useMemo(() => {
    return isSorted ? priceLower : priceUpper?.invert();
  }, [isSorted, priceLower, priceUpper]);

  const rightPrice = useMemo(() => {
    return isSorted ? priceUpper : priceLower?.invert();
  }, [isSorted, priceUpper, priceLower]);

  const currentPrice = useMemo(() => {
    if (!mintInfo.price) return;

    let _price = mintInfo.invertPrice
      ? parseFloat(mintInfo.price.invert().toSignificant(5))
      : parseFloat(mintInfo.price.toSignificant(5));

    if (Number(_price) <= 0.0001) {
      return `< 0.0001 ${currencyB?.symbol}`;
    } else {
      return `${_price} ${currencyB?.symbol}`;
    }
  }, [mintInfo.price, initialTokenPrice]);

  return (
    <>
      {currentPrice && (
        <StyledCurrentPriceWrapper
          alignItems="center"
          justifyContent="space-between"
          mb={8}
        >
          <Heading level={4} className="mb-05 mxs_mt-05">
            {initial
              ? `Initial ${currencyA?.symbol} to ${currencyB?.symbol} price`
              : `Current ${currencyA?.symbol} to ${currencyB?.symbol} price`}
          </Heading>
          <Skeleton
            startColor="grayBorderBox"
            endColor="bgBoxLighter"
            h="28px"
            w={currentPrice ? 'fit-content' : '40px'}
            isLoaded={Boolean(currentPrice)}
          >
            <StyledCurrentPrice>{currentPrice}</StyledCurrentPrice>
          </Skeleton>
        </StyledCurrentPriceWrapper>
      )}
      <Grid templateColumns={'repeat(2, 1fr)'} columnGap={6}>
        <GridItem className={`min-price mxs_mb-1`}>
          <RangeSelectorPart
            value={
              mintInfo.ticksAtLimit[Bound.LOWER]
                ? '0'
                : leftPrice?.toSignificant(5) ?? ''
            }
            onUserInput={onLeftRangeInput}
            width="100%"
            decrement={isSorted ? getDecrementLower : getIncrementUpper}
            increment={isSorted ? getIncrementLower : getDecrementUpper}
            decrementDisabled={mintInfo.ticksAtLimit[Bound.LOWER]}
            incrementDisabled={mintInfo.ticksAtLimit[Bound.LOWER]}
            label={leftPrice ? `${currencyB?.symbol}` : '-'}
            tokenA={currencyA ?? undefined}
            tokenB={currencyB ?? undefined}
            initialPrice={mintInfo.price}
            disabled={disabled}
            title={'Min price'}
          />
        </GridItem>
        <GridItem className="max-price mxs_mt-1">
          <RangeSelectorPart
            value={
              mintInfo.ticksAtLimit[Bound.UPPER]
                ? '∞'
                : rightPrice?.toSignificant(5) ?? ''
            }
            onUserInput={onRightRangeInput}
            decrement={isSorted ? getDecrementUpper : getIncrementLower}
            increment={isSorted ? getIncrementUpper : getDecrementLower}
            incrementDisabled={mintInfo.ticksAtLimit[Bound.UPPER]}
            decrementDisabled={mintInfo.ticksAtLimit[Bound.UPPER]}
            label={rightPrice ? `${currencyB?.symbol}` : '-'}
            tokenA={currencyA ?? undefined}
            tokenB={currencyB ?? undefined}
            initialPrice={mintInfo.price}
            disabled={disabled}
            title={`Max price`}
          />
        </GridItem>
      </Grid>
    </>
  );
}
