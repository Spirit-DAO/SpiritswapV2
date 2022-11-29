import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Center, SimpleGrid, Text } from '@chakra-ui/react';
import { TokenAmountPanel } from 'app/components/NewTokenAmountPanel';
import { ArrowDownIcon } from 'app/pages/Home';
import { Token } from 'app/interfaces/General';
import Web3Monitoring, {
  MonitorTx,
} from 'app/connectors/EthersConnector/transactions';
import { GELATO_NATIVE_ASSET_ADDRESS } from 'utils/swap/gelato';
import { placeOrderLimit, wrappedFTMaction } from 'utils/web3/actions/swap';
import { SwapProps } from 'app/pages/Swap/Swap.d';
import PartnersIcons from 'app/pages/Home/PartnersIcons';
import { LimitOrders } from 'app/components/LimitOrders';
import {
  LIMIT_PAY,
  LIMIT_PRICE,
  LIMIT_RECIEVE,
  GELATO_APPROVE_ADDRESS,
} from 'constants/index';
import { useCheckAllowance } from 'app/hooks/useCheckAllowance';
import { approve, transactionResponse } from 'utils/web3';
import UseIsLoading from 'app/hooks/UseIsLoading';
import useWallets from 'app/hooks/useWallets';

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
    GELATO_APPROVE_ADDRESS,
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

  const approveToken = async () => {
    try {
      if (firstToken && trade && !isWrapped) {
        const tx = await approve(
          firstToken.tokenSelected.address,
          GELATO_APPROVE_ADDRESS,
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
        const outputAmount = secondToken.receive;

        const inputToken =
          firstToken.tokenSelected.symbol === 'FTM'
            ? GELATO_NATIVE_ASSET_ADDRESS
            : firstToken.tokenSelected.address;
        const outputToken =
          secondToken.tokenSelected.symbol === 'FTM'
            ? GELATO_NATIVE_ASSET_ADDRESS
            : secondToken.tokenSelected.address;

        const response = await placeOrderLimit(account, {
          account,
          inputToken,
          outputToken,
          inputAmount,
          minReturn: outputAmount || '0',
          inputDecimals: firstToken.tokenSelected.decimals,
          outputDecimals: secondToken.tokenSelected.decimals,
        });

        addToQueue(response);

        resetValues();
      }
      loadingOff();
    } catch (error) {
      loadingOff();
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
    if (!firstToken.value) return DISABLED;
    if (txLoading) return DISABLED;
    if (isWrapped && firstToken.value) return NOT_DISABLED;
    if (!trade) return DISABLED;
    if (!hasBalance) return DISABLED;
    if (isLimitBuy && priceImpact > 0) return DISABLED;
    if (
      !isLimitBuy &&
      priceImpact < 0 &&
      secondToken.receive &&
      +secondToken.receive > 0
    )
      return DISABLED;
    return NOT_DISABLED;
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
          isLimit
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
        <Box display="flex" justifyContent="right">
          <img
            style={{ marginRight: '-15px' }}
            width="170px"
            height="20px"
            alt="Powered By Gelato"
            src={PartnersIcons.PowerByGelato}
          />
        </Box>
      </Box>
    </Box>
  );
}
