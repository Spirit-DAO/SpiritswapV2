import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { formatAmount } from 'app/utils';
import { useTranslation } from 'react-i18next';
import { Props } from './StepRoute.d';

const StepRoute = ({ step, stepIndex }: Props) => {
  const { t } = useTranslation();
  const { type, action, estimate, toolDetails } = step;
  const { name } = toolDetails;
  const { toAmount } = estimate;
  const { fromToken, fromAmount, toToken } = action;
  const { symbol, decimals } = fromToken;
  const { symbol: symbolTo, decimals: decimalsTo } = toToken;

  const isCross = type === 'cross';
  const stepSymbol = isCross ? symbol : symbolTo;
  const stepAmount = isCross ? fromAmount : toAmount;
  const stepDecimals = isCross ? decimals : decimalsTo;
  const amount = formatAmount(stepAmount, stepDecimals, 4);

  const translationPath = 'bridge.common';

  const label = {
    cross: t(`${translationPath}.transfer`),
    swap: t(`${translationPath}.swap`),
  };
  return (
    <Flex w="full" justify="space-between" key={step.id}>
      <Flex
        color="ci"
        bg="ciTrans15"
        w="5%"
        align="center"
        justify="center"
        mr={1}
        borderRadius="4px"
        p="8px"
      >
        {stepIndex}
      </Flex>
      <VStack
        bg="bgBoxLighter"
        w="95%"
        align="start"
        justify="center"
        borderRadius="4px"
        p="8px"
      >
        <Box>
          <Text color="grayDarker" fontSize="sm">
            {`${label[type]} via ${name}`}
          </Text>
          <Text>{`${amount} ${stepSymbol}`}</Text>
        </Box>
      </VStack>
    </Flex>
  );
};

export default StepRoute;
