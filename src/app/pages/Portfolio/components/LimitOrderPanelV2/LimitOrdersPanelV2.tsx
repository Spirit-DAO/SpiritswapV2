import { HStack, Text, VStack } from '@chakra-ui/react';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { getRoundedSFs, truncateTokenValue } from 'app/utils';
import { BASE_TOKEN_ADDRESS, WFTM } from 'constants/index';
import { formatUnits } from 'ethers/lib/utils';
import { ChangeEvent, useEffect, useState } from 'react';
import { getTokenUsdPrice } from 'utils/data';
import { GelattoLimitOrder } from 'utils/swap/types';
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

  useEffect(() => {
    let openLimitOrders: OpenLimitOrder[] = [];
    let posValueAmount: number = 0;

    const getOpenOrders = async (orders: GelattoLimitOrder[]) => {
      loadingOn();
      await Promise.all(
        orders.map(async order => {
          if (order.status === 'open') {
            const {
              inputTokenData,
              outputTokenData,
              bought,
              adjustedMinReturn,
              inputAmount,
            } = order;

            const inputDecimals = inputTokenData?.decimals || 18;
            const outputDecimals = outputTokenData?.decimals || 18;

            const inputSymbol = inputTokenData?.symbol || 'Unknown';
            const outputSymbol = outputTokenData?.symbol || 'Unknown';

            let payingAmount = parseFloat(
              formatUnits(inputAmount || '0', inputDecimals),
            );

            let receivingAmount = parseFloat(
              formatUnits(bought || adjustedMinReturn || '0', outputDecimals),
            );

            let priceAmount = payingAmount / receivingAmount;

            if (inputTokenData) {
              const { address: inputAddress, chainId } = inputTokenData;

              let address = inputAddress;
              if (inputAddress === BASE_TOKEN_ADDRESS) address = WFTM.address;
              const tokenUsdPrice = await getTokenUsdPrice(address, chainId);

              posValueAmount += payingAmount * tokenUsdPrice;
            }
            const paying = `${getRoundedSFs(`${payingAmount}`)} ${inputSymbol}`;
            const price = `${getRoundedSFs(`${priceAmount}`)} ${outputSymbol}`;
            const receiving = `${getRoundedSFs(
              `${receivingAmount}`,
            )} ${outputSymbol}`;

            openLimitOrders.push({
              paying,
              price,
              receiving,
              pair: [inputSymbol, outputSymbol],
            });
          }
        }),
      );
      setOpenOrder(openLimitOrders);
      setTotalValue(posValueAmount);
      loadingOff();
    };

    if (limitOrders.length && openOrder.length === 0)
      getOpenOrders(limitOrders);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
