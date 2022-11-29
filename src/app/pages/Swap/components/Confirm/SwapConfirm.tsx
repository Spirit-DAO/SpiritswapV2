import {
  Button,
  GridItem,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react';
import NewTokenAmountPanel from 'app/components/NewTokenAmountPanel/NewTokenAmountPanel';
import { useTranslation } from 'react-i18next';
import useLogin from 'app/connectors/EthersConnector/login';
import { SwapConfirmProps } from '../../Swap.d';
import { ArrowLeftIcon, WarningIcon } from 'app/assets/icons';
import { StyledIcon } from '../../styles';
import { CardHeader } from 'app/components/CardHeader';
import { formatAmount, formatCryptoNumber, isVerifiedToken } from 'app/utils';
import { swapTransaction, wrappedFTMaction } from 'utils/web3';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { useState } from 'react';
import Web3Monitoring, {
  MonitorTx,
} from 'app/connectors/EthersConnector/transactions';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { SuggestionsTypes } from 'app/hooks/Suggestions/Suggestion';
import { SPIRIT } from 'constants/index';
import useWallets from 'app/hooks/useWallets';
import useGetGasPrice from 'app/hooks/useGetGasPrice';
import useSettings from 'app/hooks/useSettings';
export default function SwapConfirm({
  firstToken,
  secondToken,
  setSwapConfirm,
  isWrapped,
  showInputInUSD,
  isLimit,
  trade,
  resetInput,
}: SwapConfirmProps) {
  const { t } = useTranslation();
  const translationsPath = 'swap.panels.swap';
  const questionHelperPath = 'swap.questionHelper';
  const { account, isLoggedIn } = useWallets();
  const { addToQueue } = Web3Monitoring();
  const { isLoading, loadingOff, loadingOn } = UseIsLoading();
  const [loaderText, setLoaderText] = useState('Loading');
  const { handleLogin } = useLogin();
  const { states } = useSettings();
  const { gasPrice } = useGetGasPrice({ speed: states.txSpeed });

  const tokenA = firstToken.tokenSelected;
  const tokenB = secondToken.tokenSelected;

  const titleLabel = () => {
    if (isLimit) t(`${translationsPath}.confirmLimitOrder`);
    if (isWrapped && tokenB.symbol === 'WFTM') return 'Confirm Wrap';
    if (isWrapped && tokenB.symbol === 'FTM') return 'Confirm unWrap';
    return t(`${translationsPath}.confirmSwap`);
  };
  const processSwap = async () => {
    if (isWrapped) {
      try {
        const isDeposit = tokenA.symbol === 'FTM';
        loadingOn();
        setLoaderText(`${isDeposit ? 'Wrap ' : 'Unwrap'} pending`);

        const response = await wrappedFTMaction(
          isDeposit,
          firstToken.value,
          addToQueue,
        );
        await response.wait();
        resetInput();
        setSwapConfirm(false);
        loadingOff();
      } catch (error) {
        setLoaderText('Loading');
        loadingOff();
      }
    } else if (trade && account) {
      try {
        loadingOn();
        setLoaderText('Pending Transaction');
        const response = await swapTransaction(
          account,
          trade,
          firstToken.tokenSelected,
          secondToken.tokenSelected,
          gasPrice,
          states.deadline,
        );

        const suggestionData = {
          type: SuggestionsTypes.SWAP,
          id: response.tx.hash,
          data: {
            swappingToSpirit: tokenB.address === SPIRIT.address,
            swappingWhitelistedTokens:
              isVerifiedToken(tokenA.address) &&
              isVerifiedToken(tokenB.address),
            tokensToLink: {
              tokenA: tokenA.symbol.toUpperCase(),
              tokenB: tokenB.symbol.toUpperCase(),
            },
          },
        };
        addToQueue(response, suggestionData);
        resetInput();
        setSwapConfirm(false);
        await response.tx.wait();
        loadingOff();
      } catch (error) {
        setLoaderText('Loading');
        loadingOff();
      }
    }
  };

  const cancelSwap = () => {
    setSwapConfirm(false);
  };

  const helperContent = {
    title: isLimit
      ? t(`${translationsPath}.confirmLimitOrder`)
      : t(`${translationsPath}.confirmSwap`),
    text: t(`${questionHelperPath}.swapExplanation`),
  };

  const { symbol: outputSymbol, decimals: outputDecimals } =
    secondToken.tokenSelected;
  const outputAmount = isWrapped
    ? firstToken.value
    : formatAmount(trade.buyAmount, outputDecimals, 5);
  return (
    <GridItem>
      <VStack align="stretch" spacing="25px">
        <HStack>
          <StyledIcon
            onClick={cancelSwap}
            size="sm"
            as={ArrowLeftIcon}
            aria-label="settings"
          />
          <CardHeader
            id={''}
            title={titleLabel()}
            helperContent={helperContent}
            showIcon={false}
            hideQuestionIcon={false}
          />
        </HStack>
        <VStack align="stretch" spacing="0px">
          <Text>{t(`${translationsPath}.youPay`)}</Text>
          <NewTokenAmountPanel
            inputValue={firstToken.value}
            context="token"
            showInputInUSD={showInputInUSD}
            token={firstToken?.tokenSelected}
            isSelectable={false}
            showConfirm={true}
          />
        </VStack>
        <VStack align="stretch" spacing="0px">
          <Text color="ci">
            {isLimit
              ? t(`${translationsPath}.youReceiveOnceOrderTriggers`)
              : t(`${translationsPath}.youReceive`)}
          </Text>

          <NewTokenAmountPanel
            inputValue={secondToken.value}
            context="token"
            showInputInUSD={showInputInUSD}
            token={secondToken?.tokenSelected}
            isSelectable={false}
            showConfirm={true}
          />
        </VStack>
        {!isLimit && (
          <HStack
            alignItems="center"
            bgColor="ciTrans15"
            color="ci"
            borderRadius="4px"
          >
            <WarningIcon ml="10px" width="16px" height="16px" />

            <VStack
              alignItems="start"
              p="8px 0px"
              fontSize="sm"
              fontWeight="400"
              spacing="0px"
            >
              <Text>{t(`${translationsPath}.outputIsEstimated`)}</Text>
              <Text>
                {`${t(
                  `${translationsPath}.outputDescription_start`,
                )} ${outputAmount} ${outputSymbol} ${t(
                  `${translationsPath}.outputDescription_end`,
                )}`}
              </Text>
            </VStack>
          </HStack>
        )}

        <SimpleGrid columns={2} spacing="0px" w="full" mt="20px">
          <Text fontSize="sm" fontWeight="400" color="gray">
            {t(`${translationsPath}.minimumReceived`)}
          </Text>
          <Text fontSize="sm" fontWeight="500" textAlign="right">
            {`${outputAmount} ${outputSymbol}`}
          </Text>

          <Text fontSize="sm" fontWeight="400" color="gray">
            {t(`${translationsPath}.rate`)}
          </Text>
          <Text fontSize="sm" fontWeight="500" textAlign="right">
            {isWrapped
              ? `1 ${tokenA.symbol} = 1 ${outputSymbol}`
              : `1 ${tokenA.symbol} = ${parseFloat(
                  formatCryptoNumber(+trade.price, outputDecimals),
                ).toFixed(6)} ${outputSymbol}`}
          </Text>

          {!isWrapped ? (
            <>
              <Flex align="center" sx={{ gap: '0.3rem' }} color="gray">
                <Text fontSize="sm" fontWeight="400">
                  {' '}
                  {t(`${translationsPath}.priceImpact`)}{' '}
                </Text>
                <QuestionHelper
                  iconWidth="16.01px"
                  title={t(`${translationsPath}.priceImpact`)}
                  text={t(`${translationsPath}.priceImpactExpaination`)}
                />
              </Flex>

              <Text fontSize="sm" fontWeight="500" textAlign="right" color="ci">
                {trade
                  ? `${parseFloat(trade.estimatedPriceImpact).toFixed(2)}%`
                  : 'N/A'}
              </Text>
            </>
          ) : null}
        </SimpleGrid>
        <HStack mt="16px">
          <Button
            size="md"
            w="full"
            onClick={isLoggedIn ? cancelSwap : () => handleLogin()}
            variant="secondary"
          >
            {isLoggedIn
              ? t(`common.button.cancel`)
              : t(`home.common.connectWallet`)}
          </Button>
          <Button
            size="md"
            w="full"
            loadingText={loaderText}
            isLoading={isLoading}
            onClick={isLoggedIn ? processSwap : () => handleLogin()}
          >
            {isLoggedIn
              ? t(`common.button.confirm`)
              : t(`home.common.connectWallet`)}
          </Button>
        </HStack>
      </VStack>
    </GridItem>
  );
}
