import { useState, useEffect } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Center,
  Flex,
  SimpleGrid,
  Skeleton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import NewTokenAmountPanel from 'app/components/NewTokenAmountPanel/NewTokenAmountPanel';
import { useTranslation } from 'react-i18next';
import { SwapProps } from '../../Swap.d';
import { Token } from 'app/interfaces/General';
import { approve, transactionResponse } from 'utils/web3';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { NON_ZERO, NOT_ENOUGH_FUNDS } from 'constants/errors';
import { GetBalanceByToken } from 'app/utils/methods';
import { ParaSwapLogo, SlippageIcon, SwapIconButton } from 'app/assets/icons';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { ConnectWallet } from 'app/components/ConnectWallet';
import { useCheckAllowance } from 'app/hooks/useCheckAllowance';
import useWallets from 'app/hooks/useWallets';
import { openInNewTab } from 'app/utils/redirectTab';
import { getPricesByPools } from 'utils/apollo/queries';

const mockInputToken = {
  name: 'USD Coin',
  symbol: 'USDC',
  address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  chainId: 137,
  decimals: 6,
};

export default function SwapPanel({ panelProps, isWrapped }) {
  const { t } = useTranslation();
  const translationsPath = 'swap.panels.swap';
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const settingsTranslationPath = 'swap.settings';
  const { addToQueue } = Web3Monitoring();
  const { isLoggedIn, account } = useWallets();
  const {
    trade,
    handleChangeInput,
    handleChangeToken,
    firstToken,
    secondToken,
    slippage,
    isLoading,
    swapAmountPanel,
    setSwapConfirm,
    showInputInUSD,
    setShowInputInUSD,
    toggleSettings,
    approveMax,
    apiCallError,
  }: SwapProps = panelProps;
  const { isLoading: txLoading, loadingOff, loadingOn } = UseIsLoading();
  const [loaderText, setLoaderText] = useState('Loading');
  const [loadAmountInput1, setLoadAmountInput1] = useState(false);
  const [loadAmountInput2, setLoadAmountInput2] = useState(false);
  const [isBalanceSufficient, setIsBalanceSufficient] = useState(true);
  const [errorMessage, setErrorMessage] = useState<{
    msg: string | null;
    relevantTokens: string[] | null;
  }>({
    msg: '',
    relevantTokens: [],
  });
  const [balanceData, setBalanceData] = useState({
    hasBalance: false,
    symbol: '',
    isOutput: false,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [approved, setApproved, approvalDiff] = useCheckAllowance(
    firstToken,
    secondToken,
    account,
    trade?.allowanceTarget,
  );

  const firstTokenBalance = GetBalanceByToken(firstToken.tokenSelected).balance;

  const approveToken = async () => {
    try {
      if (firstToken && trade) {
        setIsApproving(true);
        const tx = await approve(
          firstToken.tokenSelected.address,
          trade.allowanceTarget,
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
        setIsApproving(false);
        return true;
      }
    } catch (error) {
      loadingOff();
      setIsApproving(false);
      setLoaderText('Loading');
      return false;
    }
  };

  const hasErrors = () => {
    const checkNonZeroValue = !+firstToken.value;
    if (checkNonZeroValue)
      setErrorMessage({ msg: NON_ZERO, relevantTokens: [] });
    if (!isBalanceSufficient)
      setErrorMessage({ msg: NOT_ENOUGH_FUNDS, relevantTokens: [] });
    return checkNonZeroValue || !isBalanceSufficient;
  };

  const buttonAction = async () => {
    if (!isLoggedIn) {
      onOpen();
      return;
    }

    if (!hasErrors()) {
      let approveSuccess: boolean | undefined = true;
      if (!approved) {
        loadingOn();
        setLoaderText('Pending Approval');
        approveSuccess = await approveToken();
      }

      if (approveSuccess) {
        loadingOn();
        setLoaderText('Pending Transaction');
        return setSwapConfirm(true);
      }
    }
  };

  const onChangeNumberInput = (value, type: number) => {
    if (type === 0) {
      setLoadAmountInput2(true);
      setLoadAmountInput1(false);
    } else if (type === 1) {
      setLoadAmountInput1(true);
      setLoadAmountInput2(false);
    }
    handleChangeInput(value, type);
  };

  const swapLegend = () => {
    const { symbol: inputSymbol } = firstToken.tokenSelected;
    const { symbol: outputSymbol } = secondToken.tokenSelected;
    if (!trade) return 'Swap Token';
    if (inputSymbol === 'FTM' && outputSymbol === 'WFTM') return 'Wrap';
    if (inputSymbol === 'WFTM' && outputSymbol === 'FTM') return 'Unwrap';
    if (!approved) return 'Approve Swap';
    return 'Swap Token';
  };

  const getDisabledStatus = (): boolean => {
    const DISABLED = true;
    const NOT_DISABLED = false;
    if (approved || isApproving) {
      if (errorMessage.msg) return DISABLED;
      if (Boolean(apiCallError)) return DISABLED;
      if (!isWrapped && !trade) return DISABLED;
      if (!firstToken.value) return DISABLED;
      if (isApproving) return DISABLED;
    }
    if (!trade) return DISABLED;
    return NOT_DISABLED;
  };

  useEffect(() => {
    const { isOutput, hasBalance } = balanceData;

    if (!isOutput) {
      setIsBalanceSufficient(firstToken.value === '' || hasBalance);
      return;
    }
    if (isOutput && +firstToken.value > +firstTokenBalance) {
      setIsBalanceSufficient(false);
      return;
    }
    setIsBalanceSufficient(true);
  }, [
    balanceData,
    firstToken.value,
    firstTokenBalance,
    txLoading,
    firstToken.tokenSelected.symbol,
    isLoggedIn,
  ]);

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

  useEffect(
    () => setErrorMessage({ msg: '', relevantTokens: [] }),
    [firstToken],
  );

  const estimateRate = () => {
    const { symbol: inputSymbol } = firstToken.tokenSelected;
    const { symbol: outputSymbol } = secondToken.tokenSelected;
    if (trade)
      return `1  ${inputSymbol} ≈ ${
        isWrapped ? '1' : parseFloat(trade.price).toFixed(5)
      } ${outputSymbol}`;

    return '-';
  };

  const [ownPriceImpact, setOwmPriceImpact] = useState<number>(0);

  useEffect(() => {
    const prices = async () => {
      const priceA = await getPricesByPools(
        firstToken.tokenSelected.address.toLowerCase(),
      );
      const priceB = await getPricesByPools(
        secondToken.tokenSelected.address.toLowerCase(),
      );
      const amountA = firstToken.value;
      const amountB = secondToken.value;

      const destAmountUSD = priceB * parseFloat(amountB);
      const srcAmountUSD = priceA * parseFloat(amountA);

      const priceImpact = ((destAmountUSD - srcAmountUSD) / srcAmountUSD) * 100;

      setOwmPriceImpact(priceImpact ?? 0);
    };

    prices();
  }, [
    firstToken.tokenSelected.address,
    secondToken.tokenSelected.address,
    firstToken.value,
    secondToken.value,
  ]);

  return (
    <Box mt="20px">
      <NewTokenAmountPanel
        onSelect={(item: Token, onClose) => handleChangeToken(item, onClose, 0)}
        inputValue={firstToken.value || ''}
        showPercentage
        context="token"
        showInputInUSD={showInputInUSD}
        setShowInputInUSD={setShowInputInUSD}
        token={firstToken?.tokenSelected || mockInputToken}
        setErrorMessage={setErrorMessage}
        isLoading={loadAmountInput1 && isLoading}
        handleCheckBalance={handleCheckBalance}
        tradeUSD={trade?.priceRoute?.srcUSD}
        errorMessage={
          errorMessage.relevantTokens
            ? errorMessage.relevantTokens.includes(
                firstToken.tokenSelected.symbol,
              ) || errorMessage.relevantTokens.length === 0
              ? errorMessage.msg
              : ''
            : ''
        }
        onChange={({ value }) => {
          onChangeNumberInput(value, 0);
        }}
      />

      <Center>
        <SwapIconButton
          horizontalRotateOnMdScreenSize={false}
          m="8px auto"
          onClick={swapAmountPanel}
        />
      </Center>

      <NewTokenAmountPanel
        setErrorMessage={setErrorMessage}
        onSelect={(item: Token, onClose) => handleChangeToken(item, onClose, 1)}
        inputValue={secondToken.value || ''}
        context="token"
        tradeUSD={trade?.priceRoute?.destUSD}
        showInputInUSD={showInputInUSD}
        setShowInputInUSD={setShowInputInUSD}
        token={secondToken?.tokenSelected || mockInputToken}
        handleCheckBalance={handleCheckBalance}
        isLoading={loadAmountInput2 && isLoading}
        isOutput
        priceDiff={trade ? ownPriceImpact : undefined}
        onChange={({ value }) => {
          onChangeNumberInput(value, 1);
        }}
      />

      {apiCallError ? (
        <Alert mt="16px" status="error" borderRadius="4px" bg="dangerBg">
          <AlertIcon />
          <AlertDescription ml="-5px">{apiCallError}</AlertDescription>
        </Alert>
      ) : null}

      <Button
        size="lg"
        mt="16px"
        w="full"
        isLoading={isLoading || txLoading}
        loadingText={loaderText}
        disabled={getDisabledStatus()}
        onClick={buttonAction}
      >
        {isLoggedIn ? swapLegend() : t(`home.common.connectWallet`)}
      </Button>

      <SimpleGrid columns={2} spacing="5px" w="full" mt="20px">
        <Text>{t(`${translationsPath}.rate`)}</Text>
        <Skeleton
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          isLoaded={!isLoading}
        >
          <Text textAlign="right">{estimateRate()}</Text>
        </Skeleton>

        <Flex align="center" sx={{ gap: '0.3rem' }}>
          <Text>{t(`${settingsTranslationPath}.slippageToleranceLabel`)} </Text>
          <QuestionHelper
            title={t(`${settingsTranslationPath}.slippageToleranceLabel`)}
            text={t(`${settingsTranslationPath}.slippageExplanation`)}
          />
        </Flex>
        <Text textAlign="right">
          {slippage}
          <Button p="0" bg="transparent" border="none" minW="0">
            <SlippageIcon
              sx={{ margin: '0 0 0 3px' }}
              w="16px"
              h="16px"
              onClick={toggleSettings}
            />
          </Button>
        </Text>
      </SimpleGrid>
      <Box textAlign="right" mt="16px">
        <Text
          fontSize="12px"
          _hover={{
            cursor: 'pointer',
          }}
          onClick={() => openInNewTab('https://www.paraswap.io/')}
        >
          Powered by {''}
          <ParaSwapLogo h="auto" w="90px" />
        </Text>
      </Box>
      <ConnectWallet isOpen={isOpen} dismiss={onClose} />
    </Box>
  );
}
