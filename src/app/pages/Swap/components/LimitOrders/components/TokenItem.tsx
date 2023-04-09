import ImageLogo from 'app/components/ImageLogo';
import { resolveRoutePath } from 'app/router/routes';
import { Flex, HStack, Box } from '@chakra-ui/react';

const TokenItem = ({ symbol, amount }) => {
  return (
    <HStack>
      <ImageLogo
        margin="0 8px 0 0"
        symbol={symbol}
        src={resolveRoutePath(`images/tokens/${symbol}.png`)}
        size="35px"
        cw="35px"
        display="inline-flex"
        va="bottom"
        m={'0 10px 0 0'}
      />

      <Flex direction={'column'}>
        <Box>{symbol}</Box>
        <Box m={0}>{amount}</Box>
      </Flex>
    </HStack>
  );
};

export default TokenItem;
