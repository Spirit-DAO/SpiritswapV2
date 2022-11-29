import React, { useState, useRef } from 'react';
import {
  useOutsideClick,
  Box,
  Flex,
  Input,
  List,
  Text,
  InputGroup,
  InputLeftElement,
  Icon,
  InputRightElement,
} from '@chakra-ui/react';
import { ReactComponent as CloseButton } from 'app/assets/images/close.svg';
import { ReactComponent as SearchIcon } from 'app/assets/images/search-loupe.svg';
import { ReactComponent as BackspaceDeleteIcon } from 'app/assets/images/backspace-delete-button.svg';
import { ListProps, Token } from 'app/interfaces/General';

export default function SelectList({
  options,
  ListItem,
  selectCallback,
  isDropdown,
  dropdownTitle,
  closeDropdown,
  isAbsolute,
  top,
}: ListProps) {
  const [items, setItems] = useState(options);
  const [value, setValue] = useState('');

  const handleInputChange = e => {
    setValue(e.target.value);
    const filteredItems = (options as Token[]).filter(
      ({ name, address, symbol }) =>
        name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        address.toLowerCase().includes(e.target.value.toLowerCase()) ||
        symbol.toLowerCase().includes(e.target.value.toLowerCase()),
    );

    setItems(filteredItems);
  };

  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;

  useOutsideClick({
    ref: ref,
    handler: closeDropdown,
  });

  const position = isAbsolute ? 'absolute' : 'relative'; //tried as direct parameter and didnt work
  const width = isAbsolute ? '90%' : 'auto';

  return (
    <Box
      ref={ref}
      p="10px"
      bg="bgBoxDarker"
      borderRadius="8px"
      border="1px solid "
      borderColor="grayBorderBox"
      position={position}
      w={width}
      top={top}
      left={{ base: '0', md: 'unset' }}
      right={{ base: '0', md: 'unset' }}
      m="auto"
      maxW="456px"
      zIndex={100}
    >
      {isDropdown && (
        <Flex justify="space-between" mb="8px" align="center">
          <Text fontSize="20px">{dropdownTitle}</Text>
          <Icon
            color="white"
            cursor="pointer"
            _hover={{
              color: 'green',
            }}
            as={CloseButton}
            onClick={closeDropdown}
          />
        </Flex>
      )}
      <InputGroup>
        <InputLeftElement
          fontWeight="400"
          children={<Icon as={SearchIcon} color="grayDarker" />}
        />
        <Input
          fontSize="sm"
          flex={1}
          placeholder="Search by name"
          _placeholder={{ color: 'grayDarker' }}
          value={value}
          onChange={handleInputChange}
        />
        {value && (
          <InputRightElement
            fontWeight="400"
            children={<Icon as={BackspaceDeleteIcon} color="grayDarker" />}
            onClick={() => handleInputChange({ target: { value: '' } })}
            _hover={{
              cursor: 'pointer',
            }}
          />
        )}
      </InputGroup>
      <Text mt="8px" p="0 8px" fontSize="14px">
        {items?.length} Pools
      </Text>
      <Box ml="5px" mt="5px" maxHeight="450px" overflowY="auto">
        <List p="5px">
          {items?.map(item => (
            <ListItem
              key={item?.address}
              item={item}
              selectCallback={selectCallback}
            />
          ))}
        </List>
      </Box>
    </Box>
  );
}
