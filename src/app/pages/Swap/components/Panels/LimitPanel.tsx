import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Center, SimpleGrid, Text } from '@chakra-ui/react';
import { TokenAmountPanel } from 'app/components/NewTokenAmountPanel';
import { ArrowDownIcon } from 'app/pages/Home';
import { Token } from 'app/interfaces/General';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import {
  placeAlgebraLimitOrdrer,
  wrappedFTMaction,
} from 'utils/web3/actions/swap';
import { SwapProps } from 'app/pages/Swap/Swap.d';
import { LimitOrders } from 'app/components/LimitOrders';
import { LIMIT_PAY, LIMIT_PRICE, LIMIT_RECIEVE } from 'constants/index';
import { useCheckAllowance } from 'app/hooks/useCheckAllowance';
import { approve, transactionResponse } from 'utils/web3';
import UseIsLoading from 'app/hooks/UseIsLoading';
import useWallets from 'app/hooks/useWallets';
import { useCurrency } from 'app/hooks/v3/useCurrency';
import { tryParseTick } from 'store/v3/mint/utils';
import contracts from 'constants/contracts';
import { CHAIN_ID } from 'constants/index';
import { usePool } from 'app/hooks/v3/usePools';
import { getTickToPrice } from '../../../../../v3-sdk/utils/getTickToPrice';
import { tickToPrice } from '../../../../../v3-sdk';
import { AlgebraLogo } from 'app/assets/icons';
import { openInNewTab } from 'app/utils/redirectTab';

export default function LimitPanel({ panelProps, isLimitBuy, isWrapped }) {
  const { t } = useTranslation();
  const translationsPath = 'swap.panels.limit';
  const { account, isLoggedIn, login } = useWallets();
  const [limitValue, setLimitValue] = useState('');
  const [writingFirstinput, setIsWritingFirstInput] = useState<boolean>(false);
  const [balanceData, setBalanceData] = useState({
    hasBalance: false,
    symbol: '',
    isOutput: false,
  });
  const { addToQueue } = Web3Monitoring();
  const {
    handleChangeInput,
    handleChangeToken,
    firstToken,
    secondToken,
    modeIndex,
    trade,
    isLoading,
    approveMax,
  }: SwapProps = panelProps;

  const { isLoading: txLoading, loadingOff, loadingOn } = UseIsLoading();
  const [approved, setApproved, approvalDiff] = useCheckAllowance(
    firstToken,
    secondToken,
    account,
    contracts.v3LimitOrderManager[CHAIN_ID],
  );

  const resetValues = () => {
    handleChangeInput('0', 0);
    handleChangeInput('0', 1);
  };

  const priceImpact = (() => {
    if (!secondToken || !secondToken?.receive || !trade || !limitValue)
      return 0;

    const price = isLimitBuy
      ? 1 / parseFloat(trade?.price)
      : parseFloat(trade?.price);
    const value = parseFloat(limitValue);
    const diff = (100 * (value - price)) / price;
    return diff.toFixed(2);
  })();

  const currencyA = useCurrency(firstToken.tokenSelected.address);
  const currencyB = useCurrency(secondToken.tokenSelected.address);

  const [token0, token1] =
    currencyA && currencyB
      ? currencyA?.wrapped.sortsBefore(currencyB.wrapped)
        ? [currencyA.wrapped, currencyB.wrapped]
        : [currencyB.wrapped, currencyA.wrapped]
      : [undefined, undefined];

  const [poolState, pool] = usePool(
    currencyA || undefined,
    currencyB || undefined,
  );

  const invertPrice = Boolean(
    currencyA && token0 && !currencyA?.wrapped.equals(token0),
  );

  const initialSellPrice = useMemo(() => {
    if (!pool) return '';

    const _newPrice =
      isLimitBuy !== invertPrice
        ? getTickToPrice(token1, token0, pool.tickCurrent)
        : getTickToPrice(token0, token1, pool.tickCurrent);

    return _newPrice?.toSignificant(4);
  }, [pool, token0, token1, invertPrice]);

  useEffect(() => {
    if (initialSellPrice) {
      setLimitValue(initialSellPrice);
    }
  }, [initialSellPrice]);

  const approveToken = async () => {
    try {
      if (firstToken && trade && !isWrapped) {
        const tx = await approve(
          firstToken.tokenSelected.address,
          contracts.v3LimitOrderManager[CHAIN_ID],
          !approveMax ? approvalDiff : undefined,
        );
        const response = transactionResponse('swap.approve', {
          operation: 'APPROVE',
          tx: tx,
          uniqueMessage: {
            text: 'Approving',
            secondText: firstToken.tokenSelected.symbol,
          },
        });

        addToQueue(response);
        await tx.wait();
        loadingOff();
        setApproved(true);
      }
    } catch (error) {
      loadingOff();
    }
  };

  const wrappedFTM = async () => {
    try {
      const isDeposit = firstToken.tokenSelected.symbol === 'FTM';
      const response = await wrappedFTMaction(
        isDeposit,
        firstToken.value,
        addToQueue,
      );
      await response.wait();

      loadingOff();
      resetValues();
    } catch (error) {
      loadingOff();
      throw '';
    }
  };

  const placeOrder = async () => {
    try {
      if (trade && firstToken?.tokenSelected && secondToken?.tokenSelected) {
        const inputAmount = firstToken.value;

        if (!currencyA || !currencyB) return;

        const tick = invertPrice
          ? tryParseTick(token1, token0, 500, limitValue, pool?.tickSpacing)
          : tryParseTick(token0, token1, 500, limitValue, pool?.tickSpacing);

        if (!tick || !token0 || !token1) return;

        const response = await placeAlgebraLimitOrdrer(
          token0,
          token1,
          inputAmount,
          isLimitBuy ? -tick : tick,
          currencyA.isNative,
          pool?.tickCurrent,
        );

        addToQueue(response);

        resetValues();
      }
      loadingOff();
    } catch (error) {
      loadingOff();
      console.log('errr', error);
      throw '';
    }
  };

  const priceValue = () => {
    if (isWrapped) return '1';
    if (trade) return trade.price;
    return '0';
  };

  if (!limitValue && priceValue()) {
    setLimitValue(priceValue()!);
  }

  const onChangeLimit = value => {
    setLimitValue(value);

    if (modeIndex === 0) return;

    handleChangeInput(
      value,
      0,
      isLimitBuy ? 'limitbuy' : 'limitsell',
      firstToken,
      secondToken,
      false,
      LIMIT_PRICE,
    );
  };

  const onInputChange = (value, type) => {
    handleChangeInput(
      value,
      0,
      isLimitBuy ? 'limitbuy' : 'limitsell',
      firstToken,
      secondToken,
      false,
      type,
    );
    if (type === LIMIT_PAY) setIsWritingFirstInput(true);
    else setIsWritingFirstInput(false);
  };

  const { hasBalance } = balanceData;

  const getDisabledStatus = (): boolean => {
    const DISABLED = true;
    const NOT_DISABLED = false;

    if (!hasBalance) return DISABLED;

    if (!firstToken.value) return DISABLED;
    if (txLoading) return DISABLED;
    if (isWrapped && firstToken.value) return NOT_DISABLED;
    if (!trade) return DISABLED;

    if (!currencyA || !currencyB || !token0 || !token1 || !pool)
      return DISABLED;

    // const _tick = invertPrice
    //   ? tryParseTick(token1, token0, 500, limitValue, pool.tickSpacing)
    //   : tryParseTick(token0, token1, 500, limitValue, pool.tickSpacing);

    if (isLimitBuy && priceImpact > 0) return DISABLED;

    if (
      !isLimitBuy &&
      priceImpact < 0 &&
      secondToken.receive &&
      +secondToken.receive > 0
    )
      return DISABLED;

    // if (_tick === undefined || !pool?.tickCurrent) return DISABLED;

    return NOT_DISABLED;
  };

  const [plusDisabled, minusDisabled] = useMemo(() => {
    if (
      !currencyA ||
      !currencyB ||
      !token0 ||
      !token1 ||
      !pool ||
      limitValue === '0'
    )
      return [true, true];

    // const _tick = invertPrice
    //   ? tryParseTick(token1, token0, 500, limitValue, pool.tickSpacing)
    //   : tryParseTick(token0, token1, 500, limitValue, pool.tickSpacing);

    // if (_tick === undefined) return [true, true];

    if (currencyA.wrapped.address === token0.address && priceImpact > 0)
      return isLimitBuy
        ? invertPrice
          ? [false, true]
          : [true, false]
        : invertPrice
        ? [true, false]
        : [false, true];

    if (currencyA.wrapped.address === token1.address && priceImpact < 0)
      return isLimitBuy
        ? invertPrice
          ? [true, false]
          : [false, true]
        : invertPrice
        ? [false, true]
        : [true, false];

    return [false, false];
  }, [
    token0,
    token1,
    currencyA,
    currencyB,
    invertPrice,
    limitValue,
    pool?.tickCurrent,
    isLimitBuy,
    pool?.tickSpacing,
    priceImpact,
  ]);

  const tickStep = (direction: 1 | -1) => {
    if (!pool) return;

    const tick = invertPrice
      ? tryParseTick(token1, token0, 500, limitValue, pool.tickSpacing)
      : tryParseTick(token0, token1, 500, limitValue, pool.tickSpacing);

    if (!token0 || !token1 || tick === undefined) {
      onChangeLimit('');
      return;
    }

    let limitOrderPrice;

    // With small tickSpacing sometimes next and previous prices are the same. BigNumber wrongly compares two real small values

    if (pool?.tickSpacing < 2) {
      limitOrderPrice = String(
        Number(limitValue) +
          Number(0.0001 * pool.tickSpacing) *
            Number(limitValue) *
            direction *
            (invertPrice ? -1 : 1),
      );
    } else {
      limitOrderPrice = invertPrice
        ? tickToPrice(
            token1,
            token0,
            tick + pool.tickSpacing * direction * -1,
          ).toSignificant(4)
        : tickToPrice(
            token0,
            token1,
            tick + pool.tickSpacing * direction,
          ).toSignificant(4);
    }

    onChangeLimit(limitOrderPrice);
  };

  const getButtonLabel = (): string => {
    if (!isLoggedIn) return t(`home.common.connectWallet`);
    const actionText = approved ? 'place' : 'approve';
    if (isWrapped && firstToken.tokenSelected.symbol === 'FTM') return 'Wrap';
    if (isWrapped && firstToken.tokenSelected.symbol === 'WFTM')
      return 'Unwrap';
    if (isLimitBuy) {
      return t(`${translationsPath}.${actionText}BuyOrder`);
    }
    return t(`${translationsPath}.${actionText}SellOrder`);
  };

  const onClickButton = () => {
    loadingOn();
    if (!isLoggedIn) {
      return login();
    }
    if (!getDisabledStatus()) {
      if (isWrapped) {
        wrappedFTM();
      }
      if (!isWrapped && approved) {
        placeOrder();
      } else {
        loadingOn();
        approveToken();
      }
    }
  };

  const handleCheckBalance = ({
    hasBalance,
    symbol,
    isOutput,
  }: {
    hasBalance: boolean;
    symbol: string;
    isOutput: boolean;
  }) => {
    setBalanceData({
      hasBalance: hasBalance,
      symbol: symbol,
      isOutput: isOutput,
    });
  };
  return (
    <Box mt="20px" w="full">
      <Box w="full">
        <TokenAmountPanel
          onSelect={(item: Token, onClose) =>
            handleChangeToken(item, onClose, 0)
          }
          context="token"
          inputValue={firstToken.value || '0'}
          token={firstToken?.tokenSelected}
          showPercentage
          handleCheckBalance={handleCheckBalance}
          isLoading={!writingFirstinput && isLoading}
          onChange={({ value }) => onInputChange(value, LIMIT_PAY)}
        >
          {!isWrapped ? (
            <LimitOrders
              isLoading={isLoading}
              token={firstToken}
              priceImpact={priceImpact}
              baseLimit={priceValue()}
              typeLimit={isLimitBuy ? 'buy' : 'sell'}
              onChange={onChangeLimit}
              getLimitTokenSymbol={() =>
                isLimitBuy
                  ? firstToken.tokenSelected.symbol
                  : secondToken.tokenSelected.symbol
              }
              limitValue={limitValue}
              token0={token0}
              token1={token1}
              tickSpacing={pool?.tickSpacing || 60}
              initialSellPrice={initialSellPrice || ''}
              tickStep={tickStep}
              plusDisabled={plusDisabled}
              minusDisabled={minusDisabled}
            />
          ) : null}
        </TokenAmountPanel>
      </Box>
      <Box w="full">
        <Center m="10px" color="ci">
          <ArrowDownIcon />
        </Center>
      </Box>

      <Box w="full">
        <TokenAmountPanel
          onSelect={(item: Token, onClose) =>
            handleChangeToken(item, onClose, 1)
          }
          inputValue={isWrapped ? firstToken.value : secondToken.receive ?? '0'}
          context="token"
          handleCheckBalance={handleCheckBalance}
          token={secondToken?.tokenSelected}
          isLoading={writingFirstinput && isLoading}
          onChange={({ value }) => onInputChange(value, LIMIT_RECIEVE)}
          isLimit
        />
      </Box>
      <Box w="full">
        <Button
          mt="16px"
          w="full"
          size="lg"
          onClick={onClickButton}
          variant={isLoggedIn && !isLimitBuy ? 'danger' : 'primary'}
          isLoading={isLoading || txLoading}
          disabled={getDisabledStatus()}
        >
          {getButtonLabel()}
        </Button>
        <SimpleGrid columns={2} spacing="0px" w="full" mt="20px">
          <Text fontSize="sm">{t(`${translationsPath}.rate`)}</Text>
          <Text fontSize="sm" textAlign="right">
            {`1 ${firstToken.tokenSelected.symbol} ≈ ${Number(
              priceValue(),
            ).toFixed(4)} ${secondToken.tokenSelected.symbol}`}
          </Text>
        </SimpleGrid>
        <Box textAlign="right" mt="16px">
          <Text
            fontSize="12px"
            _hover={{
              cursor: 'pointer',
            }}
            onClick={() => openInNewTab('https://www.algebra.finance/')}
          >
            Powered by {''}
            <AlgebraLogo h="auto" w="90px" />
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
