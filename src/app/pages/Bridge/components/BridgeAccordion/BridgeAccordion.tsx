import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { formatAmount } from 'app/utils';
import { useTranslation } from 'react-i18next';
import { StepRoute } from '../StepRoute';

import { Props } from './BridgeAccordion.d';

const BridgeAccordion = ({ title, quote }: Props) => {
  const { t } = useTranslation();
  const { includedSteps, estimate, action } = quote;
  const { toToken } = action;
  const { symbol, decimals } = toToken;
  const { gasCosts, toAmountUSD, toAmount } = estimate;
  const amountUSD = gasCosts ? gasCosts[0].amountUSD : '0.00';

  const amount = formatAmount(toAmount, decimals, 4);
  const translationPath = 'bridge.common';

  return (
    <Accordion defaultIndex={[1]} allowToggle variant="bridge">
      <AccordionItem>
        <Heading as="h2">
          <AccordionButton>
            <Box flex="1" textAlign="left">
              {`${t(`${translationPath}.${title}`)}:`}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel w="full" pb={4}>
          <VStack
            spacing={4}
            align="stretch"
            gridAutoFlow="row"
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': {
                backgroundColor: '#0D1321',
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                boxShadow: 'none',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#374151',
                borderRadius: '4px',
              },
            }}
          >
            <Text color="gray" fontSize="sm">
              {t(`${translationPath}.stepTitle`)}
            </Text>

            <VStack spacing={1}>
              {includedSteps.map((step, i) => (
                <StepRoute
                  step={step}
                  stepIndex={++i}
                  key={`step-${i}-${step.id}`}
                />
              ))}
            </VStack>
            <VStack w="full" fontSize="sm" color="gray" spacing={1}>
              <HStack w="full" justify="space-between">
                <Text>{t(`${translationPath}.estimatedToken`)}</Text>
                <Text>{`${amount} ${symbol}`}</Text>
              </HStack>
              <HStack w="full" justify="space-between">
                <Text>{t(`${translationPath}.estimatedResult`)}</Text>
                <Text>{`$${toAmountUSD}`}</Text>
              </HStack>
              <HStack w="full" justify="space-between">
                <Text>{t(`${translationPath}.estimatedGas`)}</Text>
                <Text>{`$${amountUSD}`}</Text>
              </HStack>
            </VStack>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default BridgeAccordion;
