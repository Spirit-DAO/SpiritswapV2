import { HStack, Text, VStack } from '@chakra-ui/react';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { useTokens } from 'app/hooks/useTokens';
import { truncateTokenValue } from 'app/utils';
import { CHAIN_ID } from 'constants/index';
import { formatUnits } from 'ethers/lib/utils';
import { ChangeEvent, useEffect, useState } from 'react';
import { getTokenUsdPrice } from 'utils/data';
import { AlgebraLimitOrder } from 'utils/swap/types';
import { algebraLimitOrderManagerContract } from 'utils/web3';
import LimitFooter from './Fotter';
import LimitHeader from './Header';
import { LimitOrdersPanelProps, OpenLimitOrder } from './LimitOrdersPanelV2.d';
import NotLimitOrders from './NotOrders';
import { StyledPanel } from './style';
import LimitTable from './Table';

const LimitOrdersPanelV2 = ({ limitOrders }: LimitOrdersPanelProps) => {
  const [openOrder, setOpenOrder] = useState<OpenLimitOrder[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const { isLoading, loadingOff, loadingOn } = UseIsLoading();
  const hasOpenOrders = openOrder.length > 0;
  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const { getAddressTokenInfo } = useTokens(CHAIN_ID, undefined);

  useEffect(() => {
    if (!limitOrders) return;

    let posValueAmount: number = 0;

    async function fetchAmounts(id, ...rest) {
      const limitOrderManagerContract =
        await algebraLimitOrderManagerContract();

      const decrease = limitOrderManagerContract.interface.encodeFunctionData(
        'decreaseLimitOrder',
        [id, 0],
      );
      const limitPosition =
        limitOrderManagerContract.interface.encodeFunctionData(
          'limitPositions',
          [id],
        );

      const calls = await limitOrderManagerContract?.callStatic.multicall([
        decrease,
        limitPosition,
      ]);

      const amounts = limitOrderManagerContract.interface.decodeFunctionResult(
        'decreaseLimitOrder',
        calls[0],
      );
      const position = limitOrderManagerContract.interface.decodeFunctionResult(
        'limitPositions',
        calls[1],
      );

      if (!amounts || !position) return;

      const {
        liquidity: amount,
        depositedToken,
        depositedAmount,
        tokensOwed0,
        tokensOwed1,
      } = position.limitPosition;

      const { token0, token1 } = rest[0];

      const isClosed = !+amount && !+tokensOwed0 && !+tokensOwed1;
      const isCompleted = !Boolean(+amount);

      if (isClosed || isCompleted) return;

      const completedPercent = String(
        100 - (+amount * 100) / depositedAmount,
      ).slice(0, 4);

      const tokenA = await getAddressTokenInfo(token0);
      const tokenB = await getAddressTokenInfo(token1);

      const inputToken = depositedToken ? tokenB[0] : tokenA[0];

      const inputAmount = formatUnits(depositedAmount, inputToken?.decimals);

      const tokenUsdPrice = await getTokenUsdPrice(
        inputToken?.address,
        CHAIN_ID,
      );

      posValueAmount += Number(inputAmount || 0) * tokenUsdPrice;

      return {
        ...rest[0],
        id,
        status: 'open',
        isCompleted,
        isClosed,
        amount,
        depositedToken,
        tokensOwed0,
        tokensOwed1,
        completedPercent,
        pair: [tokenA[0].symbol, tokenB[0].symbol],
      };
    }

    loadingOn();

    const ordersState = limitOrders.map(({ tokenId, ...rest }: any) =>
      fetchAmounts(tokenId, rest),
    );

    Promise.all(ordersState).then(orders => {
      const openOrders = orders.filter(order => Boolean(order));

      if (openOrders) {
        setOpenOrder(openOrders);
        setTotalValue(posValueAmount);
      }
      loadingOff();
    });
  }, [limitOrders]);

  return (
    <StyledPanel footer={hasOpenOrders && <LimitFooter />}>
      <VStack p="spacing06" w="full">
        <LimitHeader hasOpenOrders={hasOpenOrders} onSearch={onSearch} />
        {openOrder.length ? (
          <LimitTable
            isLoading={isLoading}
            openOrders={openOrder}
            searchValue={searchValue}
          />
        ) : (
          <NotLimitOrders />
        )}
        {hasOpenOrders ? (
          <HStack w="full" justify="space-between">
            <Text fontSize="base">Position Value</Text>
            <Text fontSize="xl">${truncateTokenValue(totalValue)}</Text>
          </HStack>
        ) : null}
      </VStack>
    </StyledPanel>
  );
};

export default LimitOrdersPanelV2;
