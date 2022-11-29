import { useTranslation } from 'react-i18next';
import type { Props } from './TokenPanelModal.d';
import { formatNumber } from 'app/utils';
import { Suffix } from 'app/components/Suffix';
import ImageLogo from 'app/components/ImageLogo';
import { Text, Flex, VStack, HStack } from '@chakra-ui/react';

const TokenPanelModal = ({ token, amounts }: Props) => {
  const { t } = useTranslation();
  const translationPath = 'common.tokenAmountPanel';
  const { symbol } = token;
  const USD = 4;

  const tokenAmount = amounts[symbol];
  const tokenAmountUSD = tokenAmount * USD;

  const wallet = true;
  return (
    <VStack
      bgColor="bgBoxLighter"
      borderRadius="8px"
      mt="5px"
      p={['spacing05', 'spacing04']}
    >
      <HStack spacing="auto" w="100%">
        <Text fontSize="h2">{formatNumber({ value: tokenAmount })}</Text>
        <Suffix suffix={<Text fontSize="xl2">{symbol}</Text>}>
          <ImageLogo symbol={symbol} size="30px" margin="0" />
        </Suffix>
      </HStack>

      <HStack spacing="auto" w="100%" fontSize="xs" marginTop="0px !important">
        <Flex>
          <Text color="grayText" mr="5px">
            ≈ {formatNumber({ value: tokenAmountUSD })}
          </Text>
          {
            // TODO: [DEV2-510] add this in nettokenamountpanel
          }
          <Text color="ci">( -0.1 )%</Text>
        </Flex>
        <Text>
          {wallet
            ? `${t(`${translationPath}.balance`)}: $1.97`
            : t(`${translationPath}.notConnected`)}
        </Text>
      </HStack>
    </VStack>
  );
};

export default TokenPanelModal;
