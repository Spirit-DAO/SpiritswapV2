import { Props } from './ListLiquidityItem';
import { StyledContainer } from './styles';
import ImageLogo from 'app/components/ImageLogo';
import { Flex, Text } from '@chakra-ui/react';
import { NewDropdown } from 'app/components/Menu';
import { TokenOptionsV1 } from 'app/utils/tokenOptions';
import { checkInvalidValue, truncateTokenValue } from 'app/utils';
import { V1Icon } from 'app/assets/icons';
import { ALLOW_V1_V2_MIGRATION } from 'constants/index';
import useGetTokensPrices from 'app/hooks/useGetTokensPrices';

const ListLiquidityItem = ({
  farmData,
  options,
  isV2,
  subindex,
  setOpen,
  setMigrateIndex,
  setMigrateSubIndex,
  ...props
}: Props) => {
  let {
    name: tokenName,
    address: tokenAddress,
    amount: tokenAmount,
    staked,
  } = farmData;
  const { tokensPrices } = useGetTokensPrices({
    tokenAddresses: [tokenAddress],
  });

  const pairRate = checkInvalidValue(
    `${Object.values(tokensPrices || {})[0]?.rate}`,
  );

  const tokenArray = Array.isArray(tokenName) ? tokenName : [tokenName];
  const isLP = tokenArray[0] ? tokenArray[0].includes('/') : false;
  const tokenSymbol = tokenArray[0]
    ? tokenArray[0]
        .replace(' LP', '')
        .replace(' vLP', '')
        .replace(' sLP', '')
        .trimEnd()
    : '';
  const tokenSymbols = isLP && tokenSymbol.split('/');

  const dropDownOptions =
    isLP && !isV2 && ALLOW_V1_V2_MIGRATION ? TokenOptionsV1 : options;

  const handleMigrateItem = () => {
    if (!isV2) {
      const index = staked ? 0 : 1;
      setMigrateIndex(index);
      setMigrateSubIndex(subindex);
      setOpen(true);
    }
    return undefined;
  };

  return (
    <StyledContainer data-testid="ListItem" {...props}>
      <Flex align="center">
        <Flex>
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
        {isV2 ? null : <V1Icon width="20px" ml="4px" />}
      </Flex>
      <Flex align="center">
        <Flex direction="column" align="flex-end">
          <Text>{truncateTokenValue(tokenAmount)}</Text>
          <Text fontSize="sm" color="grayDarker">
            ${truncateTokenValue(tokenAmount * parseFloat(pairRate))}
          </Text>
        </Flex>
        <NewDropdown
          items={dropDownOptions}
          migrateItem={handleMigrateItem}
          address={tokenAddress ?? '0x0000000'}
        />
      </Flex>
    </StyledContainer>
  );
};

export default ListLiquidityItem;
