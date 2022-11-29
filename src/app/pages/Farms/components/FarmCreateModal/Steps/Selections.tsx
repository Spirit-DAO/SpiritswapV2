import { FC } from 'react';
import { Box, Button, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { Token } from '@lifi/sdk';
import NewTokenAmountPanel from 'app/components/NewTokenAmountPanel/NewTokenAmountPanel';
import { VARIABLE, STABLE } from 'constants/index';

import { WhiteList } from 'constants/types';
import useMobile from 'utils/isMobile';

interface Props {
  selectBase: (item: Token, onClose: () => void) => void;
  selectToken: (item: Token, onClose: () => void) => void;
  onSelectType: (type: string) => void;
  selectedBase: Token;
  selectedToken: Token;
  farmType: string;
  listTokens: {
    base: WhiteList;
    list: WhiteList;
  };
  activeStep: number;
  inspiritData: {
    totalSupply: string;
    balance: string;
  };
}

const Selections: FC<Props> = ({
  selectBase,
  selectToken,
  selectedBase,
  selectedToken,
  listTokens,
  farmType,
  onSelectType,
  activeStep,
  inspiritData,
}) => {
  const isReview = activeStep === 2;
  const isMobile = useMobile();
  const titleTokens: string = isReview
    ? 'Review your token selection'
    : 'Select the token pair';
  const titleGauge: string = isReview
    ? 'Review your Farm Type selection.'
    : 'Select the farm type';
  return (
    <VStack w="full" pt="12px" align="flex-start">
      {isReview ? (
        <VStack w="full" align="flex-start">
          <HStack w="full" justify="space-between">
            <Text color="gray">Amount needed it to create a Farm:</Text>
            <Text color="gray">{inspiritData.totalSupply}</Text>
          </HStack>
          <HStack w="full" justify="space-between">
            <Text color="gray">Your inSPIRIT balance:</Text>
            <Text color="gray">{inspiritData.balance}</Text>
          </HStack>
          <Box w="full" h={'.1rem'} bg="grayBorderBox"></Box>
        </VStack>
      ) : null}
      <VStack w="full" align="flex-start">
        <Text color="gray">{titleGauge}</Text>
        <HStack w="full">
          {isReview ? (
            <Box p="spacing03" borderRadius="sm" bg="bgInput">
              {farmType}
            </Box>
          ) : (
            <>
              <Button
                variant={farmType === VARIABLE ? 'primary' : 'inverted'}
                w="full"
                disabled={farmType === VARIABLE}
                onClick={() => onSelectType(VARIABLE)}
              >
                {VARIABLE}
              </Button>
              <Button
                variant={farmType === STABLE ? 'primary' : 'inverted'}
                w="full"
                disabled={farmType === STABLE}
                onClick={() => onSelectType(STABLE)}
              >
                {STABLE}
              </Button>
            </>
          )}
        </HStack>
      </VStack>

      <Box w="full" h={'.1rem'} bg="grayBorderBox"></Box>

      <VStack w="full" align="flex-start">
        <Text color="gray">{titleTokens}</Text>
        <Stack
          w="full"
          direction={isMobile ? 'column' : 'row'}
          justify="flex-start"
        >
          <VStack w="full" align="flex-start">
            <Text color="gray">Token 1</Text>
            <NewTokenAmountPanel
              token={selectedBase}
              tokens={Object.values(listTokens.base)}
              onSelect={selectBase}
              inputValue={''}
              notShowCommonBase={true}
              context="token"
              showNumberInputField={false}
              showBalance={false}
              isSelectable={!isReview}
              height={'48px'}
              placeContent={'center'}
              notSearchToken={true}
            />
          </VStack>
          <VStack w="full" align="flex-start">
            <Text color="gray">Token 2</Text>

            <NewTokenAmountPanel
              token={selectedToken}
              tokens={Object.values(listTokens.list)}
              onSelect={selectToken}
              inputValue={''}
              notShowCommonBase={true}
              context="token"
              showNumberInputField={false}
              showBalance={false}
              isSelectable={!isReview}
              height={'48px'}
              placeContent={'center'}
              notSearchToken={true}
            />
          </VStack>
        </Stack>
      </VStack>
    </VStack>
  );
};

export default Selections;
