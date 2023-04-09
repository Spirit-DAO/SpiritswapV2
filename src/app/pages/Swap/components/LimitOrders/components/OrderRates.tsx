import { Box } from '@chakra-ui/react';

const OrderRates = ({ buyToken, sellTokenRate }) => {
  return (
    <Box>
      <Box>{`${Number(sellTokenRate).toFixed(2).replace(/\.00$/, '')} ${
        buyToken?.symbol
      }`}</Box>
    </Box>
  );
};

export default OrderRates;
