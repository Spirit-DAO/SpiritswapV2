import { Currency } from '../../../../../../v3-sdk';
import { useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';
import { updateCurrentStep } from 'store/v3/mint/actions';
import { IDerivedMintInfo, useV3MintActionHandlers } from 'store/v3/mint/hooks';
import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { StartingPrice } from 'app/components/StartingPrice';

interface IInitialPrice {
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
  mintInfo: IDerivedMintInfo;
  isCompleted: boolean;
  backStep: number;
}

export function InitialPrice({
  currencyA,
  currencyB,
  mintInfo,
  isCompleted,
  backStep,
}: IInitialPrice) {
  const { onStartPriceInput } = useV3MintActionHandlers(mintInfo.noLiquidity);

  return (
    <Flex alignItems="center">
      <Box>
        <Text whiteSpace="nowrap">{`1 ${currencyA?.symbol}`}</Text>
      </Box>
      <Box mx={4}>=</Box>
      <Input
        mr={4}
        onChange={e => onStartPriceInput(e.target.value)}
        placeholder={'Initial price'}
      />
      <Box>
        <Text whiteSpace="nowrap">{currencyB?.symbol}</Text>
      </Box>
    </Flex>
  );
}
