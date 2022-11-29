import { Flex, List, ListItem, Text } from '@chakra-ui/react';
import { ListPoolItemProps } from 'app/interfaces/General';
import ImageLogo from 'app/components/ImageLogo';
import { IconButton, Icon as ChakraIcon } from '@chakra-ui/react';
import { ReactComponent as CaretDownIcon } from 'app/assets/images/caret-down.svg';
import { useState } from 'react';

export const ListPoolDetailsItem = ({
  item,
  selectCallback,
}: ListPoolItemProps) => {
  const poolSymbols = item.tokens.map(token => token.symbol);

  const [showDetails, setShowDetails] = useState(false);

  return (
    <ListItem key={item.address} display="flex" flexDirection="column">
      <Flex
        backgroundColor="bgBoxLighter"
        p="12px 16px"
        _hover={{
          bgColor: 'grayBorderToggle',
        }}
        mt="4px"
      >
        <Flex
          flexDirection="column"
          onClick={() => selectCallback(item)}
          w="100%"
        >
          <Flex mb="10px" flexWrap="wrap">
            {poolSymbols.map((tokenSymbol, index) => {
              return (
                <ImageLogo
                  key={`${index}-${tokenSymbol}`}
                  symbol={tokenSymbol}
                  size="32px"
                  margin="0 4px 4px 0"
                />
              );
            })}
          </Flex>
          <Text fontWeight="500">{item.name}</Text>
        </Flex>
        <IconButton
          ml="auto"
          background="transparent"
          alignSelf="center"
          border="1px solid transparent !important"
          fontSize="xx-large"
          onClick={() => setShowDetails(!showDetails)}
          aria-label="show details"
          icon={
            <ChakraIcon
              transform={showDetails ? 'rotate(180deg)' : ''}
              as={CaretDownIcon}
              color="ci"
              style={{ transition: 'all .2s ease-out' }}
            />
          }
        />
      </Flex>
      {showDetails && (
        <List m="8px 16px">
          {item.tokens.map((token, i) => (
            <ListItem
              key={`list${token.address}`}
              display="flex"
              w="100%"
              p="0 16px"
              backgroundColor={i % 2 !== 0 ? 'bgBox' : ''}
            >
              <Text
                color="gray"
                fontSize="sm"
                fontWeight="400"
              >{`${token.symbol}:`}</Text>
              <Text color="gray" fontSize="sm" fontWeight="500" ml="auto">
                0%
              </Text>
            </ListItem>
          ))}
        </List>
      )}
    </ListItem>
  );
};
