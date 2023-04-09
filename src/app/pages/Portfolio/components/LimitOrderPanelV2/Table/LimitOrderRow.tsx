import { useMemo } from 'react';

import Col from './Col';
import Cell from './Cell';
import { Flex, Td, Text, Tr } from '@chakra-ui/react';
import { useCurrency } from '../../../../../hooks/v3/useCurrency';
import { tickToPrice } from '../../../../../../v3-sdk';
import { formatUnits } from 'ethers/lib/utils';

const LimitOrderRow = ({ limitOrder, isMobile }) => {
  const { token0, token1, tick, depositedAmount, depositedToken } = limitOrder;

  const tokenA = useCurrency(token0);
  const tokenB = useCurrency(token1);

  const sellingToken =
    tokenA && tokenB
      ? tickToPrice(tokenA?.wrapped, tokenB?.wrapped, tick)
      : undefined;

  const sellAmount = useMemo(() => {
    if (!depositedAmount || !tokenA || !tokenB) return 0;

    return Number(
      formatUnits(
        depositedAmount,
        depositedToken ? tokenB.decimals : tokenA.decimals,
      ),
    )
      .toFixed(2)
      .replace(/\.00$/, '');
  }, [tokenA, tokenB, depositedAmount, depositedToken, sellingToken]);

  const buyPrice = useMemo(() => {
    if (!sellingToken || !sellAmount) return 0;

    if (!depositedToken) {
      return (
        Number(sellAmount) / Number(sellingToken.invert().toSignificant(18))
      )
        .toFixed(2)
        .replace(/\.00$/, '');
    }

    return (Number(sellAmount) / Number(sellingToken.toSignificant(18)))
      .toFixed(2)
      .replace(/\.00$/, '');
  }, [tokenA, tokenB, sellingToken, sellAmount, depositedToken]);

  const [sellToken, buyToken] = useMemo(() => {
    if (!tokenA || !tokenB) return [undefined, undefined];

    return depositedToken ? [tokenB, tokenA] : [tokenA, tokenB];
  }, [depositedToken, tokenA, tokenB]);

  const [sellTokenRate, buyTokenRate] = useMemo(() => {
    if (!sellingToken) return [undefined, undefined];

    return depositedToken
      ? [sellingToken.invert().toSignificant(2), sellingToken.toSignificant(2)]
      : [sellingToken.toSignificant(2), sellingToken.invert().toSignificant(2)];
  }, [depositedToken, sellingToken]);

  if (isMobile)
    return (
      <Col fontSize="sm">
        <Cell autoHeight={false}>
          <Flex flexDir="column">
            <Text>{sellToken?.symbol}</Text>
            <Text>{buyToken?.symbol}</Text>
          </Flex>
        </Cell>
        <Cell>{`${sellAmount} ${sellToken?.symbol}`}</Cell>
        <Cell>{`${sellTokenRate} ${buyToken?.symbol}`}</Cell>
        <Cell>{`${buyPrice} ${buyToken?.symbol}`}</Cell>
      </Col>
    );

  return (
    <Tr fontSize="sm" h="54px">
      <Td>
        <Text flexGrow={1}>{sellToken?.symbol}</Text>
        <Text flexGrow={1}>{buyToken?.symbol}</Text>
      </Td>
      <Td>{`${sellAmount} ${sellToken?.symbol}`}</Td>
      <Td>{`${sellTokenRate} ${buyToken?.symbol}`}</Td>
      <Td>{`${buyPrice} ${buyToken?.symbol}`}</Td>
    </Tr>
  );
};

export default LimitOrderRow;
