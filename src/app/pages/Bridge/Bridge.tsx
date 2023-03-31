import { useState, useCallback, useMemo, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BridgeTokenContainer, Container, PageContent } from './styles';
import { LabelTrade } from './components/LabelTrade';
import { useTranslation } from 'react-i18next';
import { INITIALBRIDGE } from 'constants/networks';
import { ReactComponent as SettingSwap } from 'app/assets/images/settings.svg';
import {
  NetworkSelectionProps,
  SelectedNetworksProps,
} from 'app/interfaces/Bridge';
import NewTokenAmountPanel from 'app/components/NewTokenAmountPanel/NewTokenAmountPanel';
import { Token } from 'app/interfaces/General';
import {
  Box,
  Grid,
  Image,
  VStack,
  HStack,
  Text,
  Flex,
  Link,
} from '@chakra-ui/react';
import { CardHeader } from 'app/components/CardHeader';
import { ARROWBACK, BRIDGE } from 'constants/icons';
import { ButtonGroup } from './components/ButtonGroup';
import { setupNetwork } from 'utils/web3';
import useMobile from 'utils/isMobile';
import { NetworksPanels } from './components/NetworksPanels';
import { formatAmount, checkAddress } from 'app/utils';
import { useLiFi } from 'app/hooks/useLiFi';
import {
  NON_ZERO,
  NOT_ENOUGH_AMOUNT,
  NOT_ENOUGH_FUNDS,
} from 'constants/errors';
import { useDebouncedValue } from 'app/hooks/useDebouncedValue';
import { useTokenBalances } from 'app/hooks/useTokenBalances';
import { CustomSetting } from './components/CustomSetting';
import { isAddress } from 'ethers/lib/utils';
import { BridgeAccordion } from './components/BridgeAccordion';
import Settings from '../Swap/components/Settings';
import { StyledIcon } from '../Swap/styles';
import useGetPriceDiff from 'app/hooks/useGetPriceDiff';
import { CHAIN_ID } from 'constants/index';
import { ToggleBridge } from './components/ToggleBridge';
import { FadeInAnimationBox } from 'app/components/FadeInAnimationBox';
import useWallets from 'app/hooks/useWallets';
import partnersIcons from '../Home/PartnersIcons';
import { TOKENS_BRIDGE } from 'constants/bridgeTokens';
import useSettings from 'app/hooks/useSettings';

export function BridgePage() {
  const { t } = useTranslation();
  const pageTitle = `${t('common.name')} - ${t('common.menu.bridge')}`;
  const isMobile = useMobile();
  const { account, isLoggedIn } = useWallets();

  const [selectedNetworks, setSelectedNetworks] =
    useState<SelectedNetworksProps>(INITIALBRIDGE);
  const { tokens: tokensFrom, isLoading: isLoadingTokensFrom } =
    useTokenBalances(selectedNetworks.From.id);
  const { tokens: tokensTo, isLoading: isLoadingTokensTo } = useTokenBalances(
    selectedNetworks.To.id,
  );

  const { states, handlers } = useSettings();
  const [inputToken, setInputToken] = useState<Token>();
  const [outputToken, setOutputToken] = useState<Token>();
  const [showConfirmModal, setshowConfirmModal] = useState(false);
  const [tokenFromValue, setTokenFromValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isQuoteAllowed, setIsQuoteAllowed] = useState(true);
  const [customAddress, setCustomAddress] = useState(account);
  const [tokenUSDAmount, setTokenUSDAmount] = useState(0);
  const handleCustomAddress = address => {
    setCustomAddress(address);
  };

  const handleError = error => {
    setErrorMessage(error);
  };

  const [showSettings, setShowSettings] = useState<boolean>(false);

  const onTokenFromValueChange = ({ value }) => {
    setTokenFromValue(value);

    if (inputToken?.priceUSD) {
      const { priceUSD } = inputToken;
      const valueUSD = Number(priceUSD) * Number(value);
      setTokenUSDAmount(valueUSD);
      const MIN_USD = 10;
      if (valueUSD < MIN_USD && account && valueUSD !== 0)
        setErrorMessage(NOT_ENOUGH_AMOUNT);
      if (valueUSD > MIN_USD) setErrorMessage('');
    }
  };
  const resetValue = () => setTokenFromValue('');

  const tokenFromValueDebounced = useDebouncedValue(tokenFromValue, 500);

  const { allowance, quote, loading, waitForReceivingChain } = useLiFi({
    toTokenAddress: outputToken?.address,
    fromChainId: selectedNetworks.From.id,
    fromTokenAddress: inputToken?.address,
    fromUserAddress: account,
    toChainId: selectedNetworks.To.id,
    tokenAmount: tokenFromValueDebounced,
    decimals: inputToken?.decimals,
    toUserAddress: isAddress(customAddress) ? customAddress : account,
    slippage: Number(states.slippage),
    bridgeMode: states.bridgeMode,
    handleError: handleError,
    tokenUSDAmount,
  });

  const networkDropdownLabelFrom = t('bridge.label.from', 'From');
  const networkDropdownLabelTo = t('bridge.label.to', 'To');

  const handleSelectedNetworks = useCallback(
    (label: string, network: NetworkSelectionProps) => {
      setSelectedNetworks(prevSelection => ({
        ...prevSelection,
        [label]: network,
      }));
      if (label === networkDropdownLabelFrom) {
        setInputToken(undefined);
      }
      if (label === networkDropdownLabelTo) {
        setOutputToken(undefined);
      }
    },
    [networkDropdownLabelFrom, networkDropdownLabelTo],
  );

  const swapNetworks = useCallback(() => {
    if (!showConfirmModal) {
      setSelectedNetworks(prevSelection => ({
        ...prevSelection,
        From: prevSelection.To,
        To: prevSelection.From,
      }));
      setInputToken(outputToken);
      setOutputToken(inputToken);
    }
  }, [setSelectedNetworks, showConfirmModal, inputToken, outputToken]);

  const handleSelectInput = (item: Token, onClose: () => void) => {
    setInputToken(item);

    onClose();
  };
  const handleSelectOutput = (item: Token, onClose: () => void) => {
    setOutputToken(item);
    onClose();
  };

  const handleCloseModal = () => {
    setshowConfirmModal(false);
  };

  const hasError = () => {
    const tokenBalance = tokensFrom?.find(
      token => token.address === inputToken?.address,
    );

    if (tokenBalance && tokenFromValue) {
      if (Number(tokenBalance.amount) < Number(tokenFromValue)) {
        setErrorMessage(NOT_ENOUGH_FUNDS);
        return true;
      }
    }

    if (!tokenFromValue || Number(tokenFromValue) === 0) {
      setErrorMessage(NON_ZERO);
      return true;
    }
  };

  const handleConfirmModal = () => {
    setErrorMessage(null);

    if (!hasError()) {
      setupNetwork(selectedNetworks.From.id);
      setshowConfirmModal(true);
    }
  };

  const tokenToValue = useMemo(() => {
    if (quote) {
      setIsQuoteAllowed(true);
      return formatAmount(
        quote.estimate.toAmount,
        quote.action.toToken.decimals,
      );
    } else {
      setIsQuoteAllowed(false);
    }
    return '';
  }, [quote]);

  useEffect(() => {
    if (errorMessage === null || errorMessage === '') {
      if (tokensFrom && !inputToken && !isLoadingTokensFrom) {
        const STABLE_FROM: string = TOKENS_BRIDGE[selectedNetworks.From.id][0];
        const stableToken = tokensFrom.find(t =>
          checkAddress(t.address, STABLE_FROM),
        );
        setInputToken(stableToken ? stableToken : tokensFrom[0]);
      }
      if (tokensTo && !outputToken && !isLoadingTokensTo) {
        const STABLE_TO: string = TOKENS_BRIDGE[selectedNetworks.To.id][0];

        const stableToken = tokensTo.find(t =>
          checkAddress(t.address, STABLE_TO),
        );
        setOutputToken(stableToken ? stableToken : tokensTo[0]);
      }
    }
  }, [
    errorMessage,
    inputToken,
    isLoadingTokensFrom,
    isLoadingTokensTo,
    outputToken,
    tokensFrom,
    tokensTo,
    selectedNetworks,
  ]);

  useEffect(() => {
    const getDiff = async () => {
      setupNetwork(selectedNetworks.From.id);
    };

    if (!isLoggedIn) {
      setCustomAddress('');
      setshowConfirmModal(false);
      setIsQuoteAllowed(true);
    }
    account && getDiff();
  }, [account, selectedNetworks, isLoggedIn]);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const priceDiff = useGetPriceDiff({
    updateOn: quote,
    inputValue: Number(tokenFromValueDebounced),
    outputValue: Number(tokenToValue),
    tokenInput: inputToken,
    tokenOutput: outputToken,
  });

  const getLoadingStatus = (): boolean => {
    if (errorMessage) return false;
    if (tokenUSDAmount < 10) return false;
    return loading;
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{pageTitle}</title>
          <meta
            name="description"
            content="A Boilerplate application homepage"
          />
        </Helmet>
      </HelmetProvider>

      <Box
        paddingTop={isMobile ? '124px' : '155px'}
        overflowX="hidden"
        overflowY="hidden"
      >
        <Container>
          <PageContent>
            <Grid
              gridTemplateColumns={isMobile ? 'auto' : '33% 520px 33%'}
              justifyContent="center"
            >
              <BridgeTokenContainer>
                {showSettings ? (
                  <Settings
                    toggleSettings={toggleSettings}
                    states={{
                      slippage: states.slippage,
                      deadline: states.deadline,
                      showChart: false,
                      speedIndex: states.speedIndex,
                      bridgeMode: states.bridgeMode,
                    }}
                    handlers={{
                      handleSlippage: handlers.handleSlippage,
                      handleShowChart: handlers.handleShowChart,
                      handleTxSpeed: handlers.handleTxSpeed,
                      handleDeadline: handlers.handleDeadline,
                      handleSpeedIndex: handlers.handleSpeedIndex,
                      handleResetAll: handlers.handleResetAll,
                      handleBridgeMode: handlers.handleBridgeMode,
                    }}
                    isBridge
                  />
                ) : (
                  <>
                    <Box mb="spacing04">
                      {showConfirmModal ? (
                        <CardHeader
                          title={t('bridge.common.confirm', 'Confirm Bridge')}
                          id={ARROWBACK}
                          hidebackground
                          hideQuestionIcon
                          onIconClick={handleCloseModal}
                        />
                      ) : (
                        <HStack w="full" justify="space-between">
                          <CardHeader
                            title={t('bridge.common.title', 'Bridge Tokens')}
                            id={BRIDGE}
                            helperContent={{
                              title: t('bridge.common.title'),
                              text: t('bridge.common.description'),
                              showDocs: true,
                            }}
                          />
                          <StyledIcon
                            onClick={toggleSettings}
                            size="sm"
                            as={SettingSwap}
                            aria-label="settings"
                          />
                        </HStack>
                      )}
                    </Box>
                    <NetworksPanels
                      handleSelectedNetworks={handleSelectedNetworks}
                      labels={{
                        from: networkDropdownLabelFrom,
                        to: networkDropdownLabelTo,
                      }}
                      selectedNetworks={selectedNetworks}
                      showConfirmModal={showConfirmModal}
                      swapNetworks={swapNetworks}
                    />
                    <VStack w="full">
                      <LabelTrade
                        label={t('bridge.label.pay', 'You pay')}
                        network={selectedNetworks.From.name}
                      />
                      <NewTokenAmountPanel
                        setErrorMessage={setErrorMessage}
                        token={inputToken}
                        bridge="from"
                        context={
                          selectedNetworks.From.id === CHAIN_ID
                            ? 'token'
                            : 'bridge'
                        }
                        inputValue={tokenFromValue}
                        onSelect={handleSelectInput}
                        onChange={onTokenFromValueChange}
                        showPercentage
                        isSelectable={!showConfirmModal}
                        showConfirm={showConfirmModal}
                        chainID={selectedNetworks.From.id}
                        errorMessage={errorMessage ? errorMessage : ''}
                        tradeUsdValue={tokenUSDAmount.toString()}
                      />
                      <LabelTrade
                        label={t('bridge.label.recieve', 'You receive')}
                        network={selectedNetworks.To.name}
                        color="ci"
                      />
                      <NewTokenAmountPanel
                        setErrorMessage={setErrorMessage}
                        token={outputToken}
                        bridge="to"
                        context={
                          selectedNetworks.To.id === CHAIN_ID
                            ? 'token'
                            : 'bridge'
                        }
                        onSelect={handleSelectOutput}
                        inputValue={tokenToValue}
                        isSelectable={!showConfirmModal}
                        showConfirm={showConfirmModal}
                        isLoading={getLoadingStatus()}
                        isOutput
                        priceDiff={priceDiff}
                        chainID={selectedNetworks.To.id}
                      />
                      <CustomSetting
                        handleCustomAddress={handleCustomAddress}
                      />
                      <ButtonGroup
                        isLoading={getLoadingStatus()}
                        showConfrimModal={showConfirmModal}
                        onClose={handleCloseModal}
                        onConfirm={handleConfirmModal}
                        waitForReceivingChain={waitForReceivingChain}
                        allowance={allowance}
                        token={inputToken}
                        secondToken={outputToken}
                        isQuoteAllowed={isQuoteAllowed}
                        quote={quote}
                        tokenFromValue={tokenFromValue}
                        resetValue={resetValue}
                        handleError={handleError}
                        errorQuote={errorMessage || ''}
                      />
                      <ToggleBridge
                        openSettings={toggleSettings}
                        bridgeMode={states.bridgeMode}
                      />
                      <Flex w="full" justify="flex-end" p="spacing03">
                        <Link
                          target="_blank"
                          href="https://li.fi"
                          style={{ textDecoration: 'none' }}
                          _hover={{ opacity: '0.4' }}
                        >
                          <HStack>
                            <Text
                              fontSize="sm"
                              color="grayDarker"
                              _hover={{ textDecoration: 'none' }}
                            >
                              Powered by
                            </Text>
                            <Image w="40px" />
                          </HStack>
                        </Link>
                      </Flex>
                    </VStack>
                  </>
                )}
              </BridgeTokenContainer>
            </Grid>

            {quote && quote.type === 'lifi' ? (
              <BridgeAccordion title="route" quote={quote} />
            ) : null}
          </PageContent>
        </Container>
      </Box>
    </>
  );
}

export default BridgePage;
