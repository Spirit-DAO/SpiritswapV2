import { Td, Tr, useMediaQuery } from '@chakra-ui/react';
import UseIsLoading from 'app/hooks/UseIsLoading';
import useWallets from 'app/hooks/useWallets';
import { useCurrency } from 'app/hooks/v3/useCurrency';
import { formatUnits } from 'ethers/lib/utils';
import { Fragment, useMemo } from 'react';
import { collectAlgebraLimitOrder } from 'utils/web3';
import { tickToPrice } from '../../../../../../v3-sdk';
import Actions from './Actions';
import OrderRates from './OrderRates';
import StatusBar from './StatusBar';
import TokenItem from './TokenItem';

import Web3Monitoring from 'app/connectors/EthersConnector/transactions';

const LimitOrderRow = ({ row }) => {
  const {
    token0,
    token1,
    tick,
    amount,
    tokensOwed0,
    tokensOwed1,
    id,
    depositedAmount,
    isCompleted,
    isClosed,
    depositedToken,
    completedPercent,
  } = row.original;

  const [isMobile] = useMediaQuery('(max-width: 640px)');

  const { loadingOn, loadingOff, isLoading } = UseIsLoading();

  const { addToQueue } = Web3Monitoring();

  const { account } = useWallets();

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
      ? [sellingToken.invert().toSignificant(18), sellingToken.toSignificant(5)]
      : [sellingToken.toSignificant(5), sellingToken.invert().toSignificant(5)];
  }, [depositedToken, sellingToken]);

  const [remainedSellToken, remainedBuyToken] = useMemo(() => {
    if (!sellingToken || !tokenA || !tokenB) return [undefined, undefined];

    return [
      Number(
        formatUnits(amount, depositedToken ? tokenB.decimals : tokenA.decimals),
      )
        .toFixed(2)
        .replace(/\.00$/, ''),
      Number(
        formatUnits(
          depositedToken ? tokensOwed0 : tokensOwed1,
          depositedToken ? tokenB.decimals : tokenA.decimals,
        ),
      )
        .toFixed(2)
        .replace(/\.00$/, ''),
    ];
  }, [tokenA, tokenB, sellingToken, depositedToken, amount]);

  const handleCollect = async () => {
    try {
      loadingOn();

      const response = await collectAlgebraLimitOrder(id, amount, account);

      addToQueue(response);
    } catch (error) {
      console.log('errr', error);
      throw '';
    } finally {
      loadingOff();
    }
  };

  const rowItems = [
    <TokenItem symbol={sellToken?.symbol} amount={sellAmount} />,
    <TokenItem symbol={buyToken?.symbol} amount={buyPrice} />,
    <OrderRates buyToken={buyToken} sellTokenRate={sellTokenRate} />,
    <StatusBar
      sellToken={sellToken}
      buyToken={buyToken}
      remainedSellToken={remainedSellToken}
      remainedBuyToken={remainedBuyToken}
      completedPercent={completedPercent}
      isClosed={isClosed}
      isCompleted={isCompleted}
    />,
    <Actions
      isCompleted={isCompleted}
      isClosed={isClosed}
      isLoading={isLoading}
      allCollect={false}
      allCancel={false}
      handleCollect={handleCollect}
    />,
  ];

  return (
    <>
      <Tr {...row.getRowProps()}>
        {row.cells.map((cell, i) => (
          <Td
            fontSize="sm"
            w="100px"
            textAlign="start"
            alignItems="center"
            height={isMobile ? 'fit-content' : '75px'}
            opacity="0.8"
            maxWidth={'fit-content'}
            width={'fit-content'}
            {...cell.getCellProps()}
          >
            <Fragment key={`limit-order-item-${i}`}>{rowItems[i]}</Fragment>
          </Td>
        ))}
      </Tr>
    </>
  );
};

export default LimitOrderRow;
