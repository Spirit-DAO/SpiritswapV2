import { Box, Flex, Text } from '@chakra-ui/react';
import { ListTokenItemProps, UserCustomToken } from 'app/interfaces/General';
import { removeUserCustomToken, setUserCustomTokens } from 'store/general';
import { useAppDispatch } from 'store/hooks';
import ImageLogo from '../ImageLogo';
import { TokenContainer } from './styles';

export default function ListTokenItem({
  item,
  onClose,
  onSelect,
  style,
}: ListTokenItemProps) {
  const dispatch = useAppDispatch();

  const handleCustomToken = (token: UserCustomToken) => {
    if (token.addedByUser) {
      dispatch(removeUserCustomToken(token.address));
      return;
    } else {
      const customToken = { ...token, addedByUser: true };
      dispatch(setUserCustomTokens({ ...customToken }));
      return;
    }
  };

  const selectedToken = {
    symbol: item.symbol,
    name: item.name,
    decimals: item.decimals,
    address: item.address,
    chainId: item.chainId,
    addedByUser: item.addedByUser,
    balance: item.balance,
    balanceUSD: item.balanceUSD,
  };

  const handleListItemClick = e => {
    if (e.target.id === 'custom-token-added-by-user') return;
    if (onSelect && onClose) onSelect(item, onClose);
  };

  return (
    <TokenContainer
      key={item.address}
      onClick={handleListItemClick}
      style={style}
    >
      <Flex alignItems="center">
        <ImageLogo
          margin="0 8px 0 0"
          symbol={item.symbol}
          src={item.logoURI}
          size="32px"
        />
        <Box>
          <Text fontWeight="500">{item.name}</Text>
          <Flex gap="3px" color="grayDarker">
            <Text color="grayDarker" fontWeight="400" fontSize="14px">
              {item.balance}
            </Text>
            <Text color="grayDarker" fontWeight="400" fontSize="14px">
              {item.symbol}
            </Text>
          </Flex>
        </Box>

        {item.hasOwnProperty('addedByUser') && (
          <Text
            id="custom-token-added-by-user"
            alignSelf="stretch"
            ml="8px"
            fontWeight="500"
            color="ci"
            cursor="pointer"
            _hover={{
              textDecoration: 'underline',
            }}
            onClick={() => handleCustomToken(selectedToken)}
          >
            {item.addedByUser ? 'Remove' : 'Add'}
          </Text>
        )}
      </Flex>

      <Box>
        <Text fontWeight="400" fontSize="14px">
          {item.balanceUSD ? `$${item.balanceUSD}` : '$0'}
        </Text>
      </Box>
    </TokenContainer>
  );
}
