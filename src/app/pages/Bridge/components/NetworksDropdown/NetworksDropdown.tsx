import { useState, useCallback } from 'react';
import { Heading } from 'app/components/Typography';
import ImageLogo from 'app/components/ImageLogo';
import { TradingDownIcon, TradingForm } from '../../styles';
import { networkColor, networkList, NETWORK } from 'constants/networks';
import { Box, Button, Flex, List, ListItem, Text } from '@chakra-ui/react';
import { Props } from './NetworksDropdown.d';
import { useOnClickOutside } from 'app/hooks/useOnClickOutSide';
import { useChains } from 'app/hooks/useChains';
import { Chain } from '@lifi/sdk';
import { elementEnable } from 'theme/thememethods';

const NetworksDropdown = ({
  network,
  label,
  updateSelectedNetworks,
  unselectableId,
  swapNetworks,
  top,
  showConfirmModal,
}: Props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { chains, getChainById } = useChains();

  const { name, chainId: id } = NETWORK[network.id];
  const colorRGBA: string = networkColor[id];

  const onToggleDropdownCallback = useCallback(() => {
    setShowDropdown(oldShowDropdown => !oldShowDropdown);
  }, [setShowDropdown]);

  const onHideDropdownCallback = useCallback(() => {
    setShowDropdown(false);
  }, [setShowDropdown]);

  const ref = useOnClickOutside<HTMLUListElement>(onHideDropdownCallback);

  const onSelectNetwork = useCallback(
    id => {
      const chain = getChainById(id);
      if (chain) {
        updateSelectedNetworks(label, {
          id: chain.id,
          name: chain.name,
          logoURI: chain.logoURI,
        });
      }
    },
    [getChainById, label, updateSelectedNetworks],
  );

  const handleNetwork = (chain: Chain) => {
    swapNetworks && unselectableId === chain.id && swapNetworks();
    unselectableId !== chain.id && onSelectNetwork?.(chain.id);
    onHideDropdownCallback();
  };

  return (
    <TradingForm top={top} ref={ref}>
      <Button
        variant="bridge"
        bg={colorRGBA}
        onClick={onToggleDropdownCallback}
        width="auto"
        borderColor="transparent"
        borderRadius="8px"
        w="100%"
        _hover={elementEnable(!showConfirmModal)}
      >
        <Box color="gray">
          <Heading level={5} color="inherit">
            {label}
          </Heading>
          <Flex align="center" justify="center">
            <ImageLogo symbol={name} type="network" size="35px" />
            <Heading level={2}>{name}</Heading>
            <TradingDownIcon />
          </Flex>
        </Box>
      </Button>
      {showDropdown && !showConfirmModal && (
        <List
          position="absolute"
          overflowY="scroll"
          zIndex={1}
          bg="bgBoxLighter"
          border="1px solid #374151"
          borderRadius="8px"
          mt="4px"
          h={{ base: '240px', md: '200px' }}
          pr="2px"
          pl="8px"
        >
          {chains
            ?.filter(chain => networkList.some(n => n.id === chain.id))
            .map(chain => (
              <ListItem
                key={chain.id}
                display="flex"
                alignItems="center"
                p="8px"
                onClick={() => handleNetwork(chain)}
                bg={id === chain.id ? 'grayBorderBox' : 'none'}
                cursor="pointer"
                borderRadius="4px"
                _hover={{ bg: 'grayBorderBox' }}
              >
                <ImageLogo
                  symbol={NETWORK[chain.id].name}
                  type="network"
                  size="24px"
                />
                <Text fontWeight="medium" lineHeight="20px">
                  {NETWORK[chain.id].name}
                </Text>
              </ListItem>
            ))}
        </List>
      )}
    </TradingForm>
  );
};

export default NetworksDropdown;
