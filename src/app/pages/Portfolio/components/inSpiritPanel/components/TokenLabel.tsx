import { Flex, HStack, Text } from '@chakra-ui/react';
import ImageLogo from 'app/components/ImageLogo';
import { getRoundedSFs, truncateTokenValue } from 'app/utils';
import { TokenLabelProps } from '..';

const TokenLabel = ({
  symbol,
  tokenBalance,
  tokenValue,
  spiritPrice,
  valueOnSpirit,
}: TokenLabelProps) => {
  const tokenOwned = tokenValue
    ? truncateTokenValue(
        Number(tokenBalance),
        tokenValue / Number(tokenBalance),
      )
    : Number(tokenBalance).toFixed(2);

  const valueToShow = valueOnSpirit
    ? `${getRoundedSFs(`${tokenValue / spiritPrice}`)} SPIRIT`
    : `$${getRoundedSFs(`${tokenValue}`, 2)}`;

  return (
    <HStack
      w="full"
      spacing="auto"
      bg="bgBoxLighter"
      p="spacing03"
      h="54px"
      borderRadius="8px"
    >
      <Flex align="center" justify="space-between" p="8px" w="full">
        <Flex align="center">
          <ImageLogo symbol={symbol} size="32px" />
          <Text ml="8px">{symbol}</Text>
        </Flex>
        <Flex direction="column" align="flex-end">
          <Text fontSize="base">{tokenOwned}</Text>
          {tokenValue && (
            <Text fontSize="sm" color="grayDarker">
              {valueToShow}
            </Text>
          )}
        </Flex>
      </Flex>
    </HStack>
  );
};

export default TokenLabel;
