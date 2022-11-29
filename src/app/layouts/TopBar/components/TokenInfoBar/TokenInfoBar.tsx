import { convertTokenPrice, getRoundedSFs } from 'app/utils';
import { Flex, Skeleton } from '@chakra-ui/react';
import type { Props } from './TokenInfoBar.d';
import {
  StyledContainer,
  StyledNameLabel,
  StyledPriceLabel,
  StyledRateLabel,
} from './styles';

const TokenInfoBar = ({
  tokenName,
  tokenPriceCurrency,
  tokenPrice,
  tokenRate,
  ...props
}: Props) => {
  const isSpirit = tokenName === 'SPIRIT';
  const isFTM = tokenName === 'FTM';

  const skeletonWidth = () => {
    switch (tokenName) {
      case 'FTM':
        return '88px';
      case 'TVL':
        return '58px';
      case 'MARKET CAP':
        return '48px';
      case 'SPIRIT':
        return '92px';
    }
  };

  return (
    <StyledContainer isSpirit={isSpirit} {...props}>
      <StyledNameLabel isSpirit={isSpirit}>{tokenName}</StyledNameLabel>
      {tokenPrice ? (
        <Flex justifyContent="center">
          <StyledPriceLabel>
            {tokenPriceCurrency}
            {isFTM || isSpirit
              ? getRoundedSFs(tokenPrice.toString())
              : convertTokenPrice(tokenPrice, 1)}
          </StyledPriceLabel>
          {tokenRate ? (
            <StyledRateLabel isPlus={tokenRate >= 0}>
              {tokenRate > 0 && `+`}
              {tokenRate?.toFixed(2)}%
            </StyledRateLabel>
          ) : null}
        </Flex>
      ) : (
        <Skeleton
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          w={skeletonWidth()}
          h="18px"
        />
      )}
    </StyledContainer>
  );
};

export default TokenInfoBar;
