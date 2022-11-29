import { Flex, ListItem, Text } from '@chakra-ui/react';
import { ListPoolItemProps } from 'app/interfaces/General';
import ImageLogo from '../ImageLogo';

export default function ListPoolItem({
  item,
  selectCallback,
}: ListPoolItemProps) {
  const poolSymbols = item.tokens.map(token => {
    return token.symbol;
  });

  return (
    <ListItem
      key={item.address}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p="4px 8px"
      _hover={{
        bgColor: 'grayBorderToggle',
      }}
      onClick={() => selectCallback(item)}
    >
      <Text>{item.name}</Text>
      <Flex>
        {poolSymbols.map((tokenSymbol, index) => {
          return (
            <ImageLogo
              key={`${index}-${tokenSymbol}`}
              symbol={tokenSymbol}
              size="32px"
            />
          );
        })}
      </Flex>
    </ListItem>
  );
}
