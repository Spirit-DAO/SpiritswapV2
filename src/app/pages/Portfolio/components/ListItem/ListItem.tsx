import { Props } from './ListItem.d';
import { StyledContainer } from './styles';
import ImageLogo from 'app/components/ImageLogo';
import { Flex, Text } from '@chakra-ui/react';
import { NewDropdown } from 'app/components/Menu';
import { truncateTokenValue } from 'app/utils';

const ListItem = ({
  tokenName,
  tokenAddress,
  tokenAmount,
  usdAmount,
  options,
  ...props
}: Props) => {
  const tokenArray = Array.isArray(tokenName) ? tokenName : [tokenName];
  const isLP = tokenArray[0] ? tokenArray[0].includes('/') : false;
  const tokenSymbol = tokenArray[0]
    ? tokenArray[0].replace(' LP', '').trimEnd()
    : '';
  const tokenSymbols = isLP && tokenSymbol.split('/');

  return (
    <StyledContainer data-testid="ListItem" {...props}>
      <Flex align="center">
        <Flex w={isLP ? '55px' : '40px'}>
          {tokenSymbols ? (
            tokenSymbols.map((symbol, index) => (
              <ImageLogo
                size="32px"
                nextPair={index > 0 ?? false}
                symbol={symbol}
                key={`token-icon-${symbol}`}
              />
            ))
          ) : (
            <ImageLogo
              size="32px"
              symbol={tokenSymbol}
              key={`token-icon-${tokenSymbol}`}
            />
          )}
        </Flex>
        <Text fontWeight="medium">{tokenArray.join('/')}</Text>
      </Flex>
      <Flex align="center">
        <Flex direction="column" align="flex-end">
          <Text>
            {truncateTokenValue(
              Number(tokenAmount),
              Number(usdAmount) / Number(tokenAmount),
            )}
          </Text>
          <Text fontSize="sm" color="grayDarker">
            {`$${truncateTokenValue(Number(usdAmount))}`}
          </Text>
        </Flex>
        <NewDropdown items={options} address={tokenAddress ?? '0x0000000'} />
      </Flex>
    </StyledContainer>
  );
};

export default ListItem;
