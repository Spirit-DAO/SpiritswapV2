import { FC } from 'react';
import type { Props } from './TokenSelection.d';
import { Flex, Text } from '@chakra-ui/react';
import ImageLogo from '../ImageLogo';
import { CaretDownIcon } from 'app/assets/icons';

const TokenSelection: FC<Props> = ({
  symbol,
  handleOpen,
  src,
  isSelectable,
}: Props) => {
  console.log({ symbol });
  return (
    <Flex
      alignItems="center"
      borderRadius="2px"
      px="spacing02"
      _hover={{
        bg: isSelectable ? 'grayBorderToggle' : 'none',
        cursor: isSelectable ? 'pointer' : 'default',
      }}
      onClick={handleOpen}
    >
      <ImageLogo symbol={symbol} src={src} size="28px" />
      <Text fontSize="xl2">{symbol}</Text>
      {isSelectable && handleOpen && <CaretDownIcon />}
    </Flex>
  );
};

export default TokenSelection;
