import { Currency } from '../../../../../../v3-sdk';
import { IDerivedMintInfo, useV3MintActionHandlers } from 'store/v3/mint/hooks';
import {
  Box,
  Flex,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';

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
      <NumberInput
        clampValueOnBlur={false}
        border="none"
        onChange={value => onStartPriceInput(value)}
        mr={4}
        w={'full'}
      >
        <NumberInputField
          inputMode="numeric"
          paddingInline="8px"
          placeholder="Initial Price"
          fontSize="xl2"
          _placeholder={{ color: 'gray' }}
          w={'full'}
        />
      </NumberInput>
      <Box>
        <Text whiteSpace="nowrap">{currencyB?.symbol}</Text>
      </Box>
    </Flex>
  );
}
