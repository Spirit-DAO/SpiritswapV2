import {
  HStack,
  Icon,
  Grid,
  Stack,
  Text,
  GridItem,
  Box,
  Flex,
  useMediaQuery,
} from '@chakra-ui/react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'app/hooks/Routing';
import Heading from './components/Heading';
import Settings from './components/Settings';
import SpiritsBackground from './components/Background';
import { SwapPanel, LimitPanel } from './components/Panels';
import { RouteContainer, SwapContainer } from './styles';
import TabSelect from 'app/components/TabSelect';
import { useTranslation } from 'react-i18next';
import { ArrowRightIcon1 } from 'app/assets/icons';
import { Token } from 'app/interfaces/General';
import { SwapState } from './Swap.d';
import tokens, { FTM } from 'constants/tokens';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { SwapProps } from './Swap.d';
import { Chart } from './components/Chart';
import { breakpoints } from 'theme/base/breakpoints';
import SwapConfirm from './components/Confirm';
import { LimitOrders } from './components/LimitOrders';
import { QuoteParams, SwapQuote } from 'utils/swap';
import UseIsLoading from 'app/hooks/UseIsLoading';
import useMobile from 'utils/isMobile';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import {
  FTM_TOKEN_NULL_ADDRESS,
  LIMIT_PAY,
  LIMIT_PRICE,
  LIMIT_RECIEVE,
  WFTM,
} from 'constants/index';
import { checkInvalidValue, getLpAddress } from 'app/utils';
import ImageLogo from 'app/components/ImageLogo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectSwapModeIndex,
  selectUserCustomTokens,
} from 'store/general/selectors';
import { setGlobalSwapModeIndex } from 'store/general';
import useQuoteRate from 'app/hooks/useQuoteRate';
import useGetGasPrice from 'app/hooks/useGetGasPrice';
import useWallets from 'app/hooks/useWallets';
import useSettings from 'app/hooks/useSettings';
import { useTokenBalance } from 'app/hooks/useTokenBalance';
import TWAPPanel from 'app/components/TWAP/TWAPPanel';
import TWAPOrders from 'app/components/TWAP/TWAPOrders';
import { SWAP } from 'app/router/routes';

const SwapPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useWallets();
  const globalSwapModeIndex = useAppSelector(selectSwapModeIndex);
  const translationPath = 'swap.questionHelper';
  const [modeIndex, setModeIndex] = useState<number>(globalSwapModeIndex || 0);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const { handlers, states } = useSettings();
  const [swapConfirm, setSwapConfirm] = useState<boolean>(false);
  const [isLimit, setIsLimit] = useState<boolean>(false);
  const [trade, setTrade] = useState<SwapQuote | undefined>(undefined);
  const [routes, setRoutes] = useState<Token[]>([]);
  const [chartUrl, setChartUrl] = useState<string>('');
  const { loadingOff, loadingOn, isLoading } = UseIsLoading();
  const isMobile = useMobile();
  const { token1, token2 } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { gasPrice, txGweiCost } = useGetGasPrice({ speed: states.txSpeed });
  const userCustomTokens = useAppSelector(selectUserCustomTokens);
  const allTokens = [...tokens, ...(userCustomTokens || [])];
  const [showChart, setShowChart] = useState<boolean>(
    states.showChart ?? false,
  );

  useEffect(() => {
    const stateFromUrl = state as { limitOrderPanel: boolean };
    if (stateFromUrl && stateFromUrl.limitOrderPanel) {
      setModeIndex(1);
    }
  }, [state]);

  const setToken = (inputToken: Token, outputToken: Token) => {
    try {
      if (inputToken.symbol === outputToken.symbol) {
        navigate(`${SWAP.path}/FTM/SPIRIT`, { replace: true });
        return [allTokens[0], allTokens[1]];
      }
      return [inputToken, outputToken];
    } catch (error) {
      return [allTokens[0], allTokens[1]];
    }
  };

  const matchesToken = (token, param) => {
    if (!param) {
      return false;
    }
    return [
      `${token.symbol}`.toLowerCase(),
      `${token.address}`.toLowerCase(),
    ].includes(param.toLowerCase());
  };

  const [queriedTokenOne] = allTokens.filter(token =>
    matchesToken(token, token1),
  );

  const [queriedTokenTwo] = allTokens.filter(token =>
    matchesToken(token, token2),
  );
  const [inputValue, outputValue] = setToken(queriedTokenOne, queriedTokenTwo);
  const initialState = {
    value: '',
    limitsell: '',
    limitbuy: '',
    tokenSelected: inputValue,
  };

  const initialState1 = {
    value: '',
    limitsell: '',
    limitbuy: '',
    tokenSelected: outputValue,
  };
  const [firstToken, setFirstToken] = useState<SwapState>(initialState);
  const [secondToken, setSecondToken] = useState<SwapState>(initialState1);
  const [showInputInUSD, setShowInputInUSD] = useState<boolean>(false);

  const isWrapped = () => {
    const { symbol: ipSymbol } = firstToken.tokenSelected;
    const { symbol: opSymbol } = secondToken.tokenSelected;
    if (ipSymbol === 'FTM' && opSymbol === 'WFTM') return true;
    if (ipSymbol === 'WFTM' && opSymbol === 'FTM') return true;
    return false;
  };
  const [quoteRateParams, setQuoteRateParams] = useState<QuoteParams>({
    buyToken: '0',
    sellToken: '0',
    buyAmount: '0',
    sellAmount: '0',
    slippagePercentage: 0,
    includedSources: '0',
    gasPrice: '0',
  });

  const [changeRateData, setChangeRateData] = useState({
    value: '0',
    type: 0,
    txType: '',
    tokenFrom: firstToken,
    tokenTo: secondToken,
    keepSecondAmount: false,
    changedTokenFrom: 0,
  });

  const { token: tokenA } = useTokenBalance(
    firstToken.tokenSelected.chainId,
    firstToken.tokenSelected.address,
    'token',
    firstToken.tokenSelected,
  );

  const { token: tokenB } = useTokenBalance(
    secondToken.tokenSelected.chainId,
    secondToken.tokenSelected.address,
    'token',
    secondToken.tokenSelected,
  );

  const { quoteRateEstimation: tx, txError } = useQuoteRate(quoteRateParams);

  useEffect(() => {
    if (queriedTokenOne && !queriedTokenTwo) {
      return navigate(
        `${SWAP.path}/${queriedTokenOne.symbol}/${
          queriedTokenOne.symbol === 'SPIRIT' ? 'FTM' : 'SPIRIT'
        }`,
        { replace: true },
      );
    }
    if (!queriedTokenOne) {
      return navigate(`${SWAP.path}/FTM/SPIRIT`, { replace: true });
    }
  }, [queriedTokenOne, queriedTokenTwo, navigate]);

  useEffect(() => {
    if (firstToken.value === '0' || firstToken.value === '') {
      setSecondToken({ ...secondToken, value: '' });
      loadingOff();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstToken]);

  useEffect(() => {
    let LPAddressFromConstants = getLpAddress(
      firstToken.tokenSelected.address,
      secondToken.tokenSelected.address,
    );

    if (!LPAddressFromConstants) {
      LPAddressFromConstants = getLpAddress(
        WFTM.address,
        secondToken.tokenSelected.address,
      );
    }

    const url = `https://dexscreener.com/fantom/${LPAddressFromConstants}?embed=1&theme=dark&trades=0&info=0`;
    setChartUrl(url);
  }, [firstToken.tokenSelected.address, secondToken.tokenSelected.address]);

  useEffect(() => {
    setIsLimit(modeIndex !== 0);
    dispatch(setGlobalSwapModeIndex(modeIndex));
    if (!isLoggedIn) {
      setShowSettings(false);
      setSwapConfirm(false);
      setTrade(undefined);
      setRoutes([]);
      setChartUrl('');
    }
  }, [modeIndex, globalSwapModeIndex, dispatch, isLoggedIn]);

  const asignTokenValues = (
    txType,
    changedTokenFrom,
    tokenOne,
    tokenTwo,
    txValue,
  ) => {
    if (txType === 'limitbuy' && changedTokenFrom === LIMIT_PAY) {
      if (tokenOne?.limitbuy) {
        const receive = checkInvalidValue(
          `${(parseFloat(txValue) * parseFloat(tokenOne.limitbuy)).toFixed(
            secondToken.tokenSelected.decimals,
          )}`,
        );
        const outputAmount: string = isWrapped() ? txValue : receive;
        setSecondToken({ ...tokenTwo, receive: outputAmount });
      }
      setFirstToken({ ...tokenOne, value: txValue });
      return;
    }

    if (txType === 'limitsell' && changedTokenFrom === LIMIT_PAY) {
      if (tokenOne?.limitsell) {
        const receive = checkInvalidValue(
          `${(parseFloat(tokenOne.limitsell) / parseFloat(txValue)).toFixed(
            secondToken.tokenSelected.decimals,
          )}`,
        );
        const outputAmount: string = isWrapped() ? txValue : receive;
        setSecondToken({ ...tokenTwo, receive: outputAmount });
      }
      setFirstToken({ ...tokenOne, value: txValue });
      return;
    }

    if (txType === 'limitbuy' && changedTokenFrom === LIMIT_PRICE) {
      const receive = checkInvalidValue(
        `${(parseFloat(tokenOne.value) / parseFloat(txValue)).toFixed(
          secondToken.tokenSelected.decimals,
        )}`,
      );
      const outputAmount: string = isWrapped() ? txValue : receive;
      setFirstToken({ ...tokenOne, limitbuy: txValue });
      setSecondToken({ ...tokenTwo, receive: outputAmount });
      return;
    }

    if (txType === 'limitsell' && changedTokenFrom === LIMIT_PRICE) {
      const receive = checkInvalidValue(
        `${(parseFloat(txValue) * parseFloat(tokenOne.value)).toFixed(
          secondToken.tokenSelected.decimals,
        )}`,
      );
      const outputAmount: string = isWrapped() ? txValue : receive;
      setFirstToken({ ...tokenOne, limitsell: txValue });
      setSecondToken({ ...tokenTwo, receive: outputAmount });
      return;
    }

    if (txType === 'limitbuy' && changedTokenFrom === LIMIT_RECIEVE) {
      if (tokenOne?.limitbuy) {
        const valuePay = checkInvalidValue(
          `${(parseFloat(txValue) / parseFloat(tokenOne.limitbuy)).toFixed(
            firstToken.tokenSelected.decimals,
          )}`,
        );
        const inputAmount: string = isWrapped() ? txValue : valuePay;
        setFirstToken({ ...tokenTwo, value: inputAmount });
      }
      setSecondToken({ ...tokenTwo, receive: txValue });
      return;
    }
    if (txType === 'limitsell' && changedTokenFrom === LIMIT_RECIEVE) {
      if (tokenOne?.limitsell) {
        const valuePay = checkInvalidValue(
          `${(parseFloat(txValue) * parseFloat(tokenOne.limitsell)).toFixed(
            firstToken.tokenSelected.decimals,
          )}`,
        );
        const inputAmount: string = isWrapped() ? txValue : valuePay;
        setFirstToken({ ...tokenTwo, value: inputAmount });
      }
      setSecondToken({ ...tokenTwo, receive: txValue });
      return;
    }
  };

  const changeRateParams = (
    value,
    type,
    txType,
    tokenFrom = firstToken,
    tokenTo = secondToken,
    keepSecondAmount = false,
    changedTokenFrom = LIMIT_PAY,
  ) => {
    loadingOn();
    const tokenADecimals = tokenFrom.tokenSelected.decimals;
    const tokenBDecimals = tokenTo.tokenSelected.decimals;
    const tokenASymbol = tokenFrom.tokenSelected.symbol;
    const tokenBSymbol = tokenTo.tokenSelected.symbol;

    let txValue: string = value === '' || value === 'Infinity' ? '0' : value;

    // set data to estimations
    setChangeRateData({
      value: txValue,
      type,
      txType,
      tokenFrom,
      tokenTo,
      keepSecondAmount,
      changedTokenFrom,
    });

    if (txType !== 'swap') {
      asignTokenValues(txType, changedTokenFrom, tokenFrom, tokenTo, txValue);
    } else if (txValue === '0') {
      setFirstToken({ ...tokenFrom, value: '' });
      setSecondToken({ ...tokenTo, value: '' });
      setTrade(undefined);
      return;
    }

    let params: QuoteParams = {
      sellToken:
        tokenASymbol === 'FTM'
          ? FTM_TOKEN_NULL_ADDRESS.address
          : tokenFrom.tokenSelected.address,
      buyToken:
        tokenBSymbol === 'FTM'
          ? FTM_TOKEN_NULL_ADDRESS.address
          : tokenTo.tokenSelected.address,
      slippagePercentage: Number(states.slippage),
    };
    if (!type) {
      if (txType === 'swap') {
        setFirstToken({ ...tokenFrom, value: txValue });
      }

      if (
        firstToken.tokenSelected &&
        tokenADecimals !== firstToken.tokenSelected.decimals
      ) {
        txValue = '1';
      }

      if (
        txType === 'limitbuy' ||
        txType === 'limitsell' ||
        txType === 'limit'
      ) {
        params.sellAmount = parseUnits(txValue, tokenADecimals).toString();
      } else {
        params.sellAmount = parseUnits(
          showInputInUSD
            ? (+txValue / tokenA.rate).toFixed(txValue.length) || '0'
            : txValue,
          tokenADecimals,
        ).toString();
      }
    } else {
      // write second input
      if (txType === 'swap') {
        params.buyAmount = parseUnits(
          showInputInUSD
            ? (+txValue / tokenB.rate).toFixed(txValue.length) || '0'
            : txValue,
          tokenBDecimals,
        ).toString();
        setSecondToken({ ...tokenTo, value: txValue });
      }
    }

    if (keepSecondAmount) {
      params.sellAmount = tokenFrom.value
        ? parseUnits(tokenFrom.value, tokenADecimals).toString()
        : '0';
      delete params.buyAmount;
    }

    params.gasPrice = `${gasPrice}`;

    setQuoteRateParams(params);
  };

  useEffect(() => {
    setEstimations(changeRateData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx, changeRateData]);

  const setEstimations = ({
    type,
    txType,
    tokenFrom,
    tokenTo,
    keepSecondAmount,
  }) => {
    const token1Decimals = tokenFrom.tokenSelected.decimals;
    const token2Decimals = tokenTo.tokenSelected.decimals;
    if (!firstToken.value && !secondToken.value) return;
    setTrade(tx);
    if (isWrapped()) {
      loadingOff();
      if (!type) {
        setSecondToken({
          ...tokenTo,
          value: firstToken.value,
        });
      } else {
        setFirstToken({
          ...tokenFrom,
          value: secondToken.value,
        });
      }
    } else if (tx && tx.buyTokenAddress && tx.orders.length) {
      loadingOff();
      if (txType === 'receive') {
        tx.price = (1 / parseFloat(tx.price)).toString();
      }

      if (txType === 'swap') {
        // We set the value for the other input form
        if (!type) {
          setSecondToken({
            ...tokenTo,
            value: showInputInUSD
              ? `${tx.priceRoute?.destUSD}`
              : formatUnits(tx.buyAmount, token2Decimals),
          });
        } else if (`${txType}` === 'receive' && type) {
          setSecondToken({
            ...tokenTo,
            value: showInputInUSD
              ? `${tx.priceRoute?.destUSD}`
              : formatUnits(tx.buyAmount, token2Decimals),
          });
        } else {
          setFirstToken({
            ...tokenFrom,
            value: showInputInUSD
              ? `${tx.priceRoute?.srcUSD}`
              : formatUnits(tx.sellAmount, token1Decimals),
          });
        }

        if (keepSecondAmount) {
          setSecondToken({
            ...tokenTo,
            value: showInputInUSD
              ? `${tx.priceRoute?.destUSD}`
              : formatUnits(tx.buyAmount, token2Decimals),
          });
        }
      }

      // Set routes for the transaction
      const routeAddresses: string[] = [];
      tx.orders.forEach(order => {
        order.fillData.tokenAddressPath.map(address =>
          routeAddresses.push(address.toLocaleLowerCase()),
        );
      });

      const routeData: Token[] = [];

      routeAddresses.forEach(rAddress => {
        const [token] = allTokens.filter(
          token => token.address.toLowerCase() === rAddress.toLowerCase(),
        );
        if (token) {
          routeData.push(token);
        }
      });

      setRoutes(routeData);
    }
  };

  const handleChangeInput = (
    value,
    type: number,
    txType: string = 'swap',
    tokenFrom = firstToken,
    tokenTo = secondToken,
    keepSecondAmount = false,
    changedTokenFrom = LIMIT_PAY,
  ) => {
    changeRateParams(
      value,
      type,
      txType,
      tokenFrom,
      tokenTo,
      keepSecondAmount,
      changedTokenFrom,
    );
  };

  const handleChangeToken = (
    tokenSelected: Token,
    onClose: () => void,
    type: number,
    txType: string = 'swap',
  ) => {
    const defaultOtherToken = tokenSelected.symbol === 'FTM' ? 'SPIRIT' : 'FTM';
    if (!type) {
      const newToken = { ...firstToken, tokenSelected };

      const firstIsSameAsSecond =
        tokenSelected.symbol === secondToken.tokenSelected.symbol;

      if (newToken.tokenSelected.symbol === secondToken.tokenSelected.symbol) {
        swapAmountPanel();
      } else {
        changeRateParams(firstToken.value, type, txType, newToken, secondToken);
      }
      navigate(
        `${SWAP.path}/${newToken.tokenSelected.symbol}/${
          firstIsSameAsSecond
            ? defaultOtherToken
            : secondToken.tokenSelected.symbol
        }`,
        { replace: true },
      );
    } else {
      const newToken = { ...secondToken, tokenSelected };

      const secondIsSameAsFirst =
        tokenSelected.symbol === firstToken.tokenSelected.symbol;

      if (newToken.tokenSelected.symbol === firstToken.tokenSelected.symbol) {
        swapAmountPanel();
      } else {
        changeRateParams(
          secondToken.value,
          type,
          txType,
          firstToken,
          newToken,
          true,
        );
      }

      navigate(
        `${SWAP.path}/${
          secondIsSameAsFirst
            ? defaultOtherToken
            : firstToken.tokenSelected.symbol
        }/${newToken.tokenSelected.symbol}`,
        { replace: true },
      );
    }
    onClose();
    loadingOff();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const toggleChart = () => {
    setShowChart(!showChart);
    handlers.handleShowChart(!showChart);
  };

  const getHelperContentSwap = (mode: number) => {
    if (mode === 0) {
      return {
        title: t(`${translationPath}.swap`) || '',
        text: t(`${translationPath}.swapExplanation`),
      };
    }
    if (mode === 1) {
      return {
        title: t(`${translationPath}.limitBuy`),
        text: t(`${translationPath}.limitBuyExplanation`),
      };
    }
    if (mode === 2) {
      return {
        title: t(`${translationPath}.limitSell`),
        text: t(`${translationPath}.limitSellExplanation`),
      };
    }
    if (mode === 3) {
      return {
        title: t(`${translationPath}.twap`),
        text: t(`${translationPath}.twapExplanation`),
      };
    }
  };

  const helperContent = getHelperContentSwap(modeIndex);

  const swapAmountPanel = () => {
    const token1 = firstToken;
    const token2 = secondToken;
    setFirstToken(token2);
    setSecondToken(token1);
    navigate(
      `${SWAP.path}/${token2.tokenSelected.symbol}/${token1.tokenSelected.symbol}`,
      { replace: true },
    );
    changeRateParams(firstToken.value, 0, 'swap', token2, token1);
  };

  const panelProps: SwapProps = {
    firstToken,
    secondToken,
    trade,
    slippage: states.slippage,
    isLoading,
    isLimit,
    handleChangeToken,
    handleChangeInput,
    showInputInUSD,
    setShowInputInUSD,
    setSwapConfirm,
    swapAmountPanel,
    toggleSettings,
    modeIndex,
    approveMax: states.approveMax,
    apiCallError: txError,
  };

  const defaultRoutes = useMemo(() => {
    const { tokenSelected: ipToken } = firstToken;
    const { tokenSelected: opToken } = secondToken;
    if (ipToken.symbol === 'FTM' && opToken.symbol === 'WFTM')
      return [FTM, WFTM];
    if (ipToken.symbol === 'WFTM' && opToken.symbol === 'FTM')
      return [FTM, WFTM];
    if (trade) return routes;
    if (ipToken.symbol === 'FTM') return [WFTM, opToken];
    if (opToken.symbol === 'FTM') return [ipToken, WFTM];
    return [ipToken, opToken];
  }, [firstToken, secondToken, trade, routes]);

  const panels = [
    {
      key: 0,
      children: <SwapPanel panelProps={panelProps} isWrapped={isWrapped()} />,
    },
    {
      key: 1,
      children: (
        <LimitPanel
          panelProps={panelProps}
          isLimitBuy={true}
          isWrapped={isWrapped()}
        />
      ),
    },
    {
      key: 2,
      children: (
        <LimitPanel
          panelProps={panelProps}
          isLimitBuy={false}
          isWrapped={isWrapped()}
        />
      ),
    },
    {
      key: 3,
      children: <TWAPPanel panelProps={panelProps} gasPrice={gasPrice} />,
    },
  ];

  const [isLessThan1100px] = useMediaQuery('(max-width: 1100px)');

  const columns = () => {
    const columns = { base: '95%' };

    if (isLimit) {
      if (isLessThan1100px) columns['md'] = '520px';
      else columns['md'] = '520px 1fr';
      return columns;
    }

    columns['md'] = showChart ? '500px 1fr' : '520px';
    return columns;
  };

  const memorizedChart = useCallback(() => {
    return <Chart islimit={isLimit} url={chartUrl} />;
  }, [chartUrl, isLimit]);

  return (
    <Box overflowX="hidden">
      <HelmetProvider>
        <Helmet>
          <title>SpiritSwap - Swap</title>
          <meta name="SpiritSwap" content="Swap page" />
        </Helmet>
      </HelmetProvider>
      <Box>
        <Grid
          display={{ base: 'grid', lg: 'grid' }}
          top={isMobile ? '124px' : '170px'}
          position="relative"
          templateRows="1fr"
          templateColumns={columns()}
          m="0 auto"
          mb="250px"
          minH="75vh"
          gap="10px"
          placeContent="center"
          maxW={{ md: breakpoints.xl }}
        >
          <GridItem rowSpan={1} colSpan={1}>
            <Box>
              <SpiritsBackground
                islimit={isLimit}
                showChart={showChart}
                showSettings={showSettings}
              />

              <SwapContainer islimit={`${isLimit}`}>
                {!swapConfirm ? (
                  <>
                    {showSettings ? (
                      <Settings
                        toggleSettings={toggleSettings}
                        txGweiCost={txGweiCost}
                        states={{
                          showChart: states.showChart,
                          slippage: states.slippage,
                          speedIndex: states.speedIndex,
                          deadline: states.deadline,
                          approveMax: states.approveMax,
                        }}
                        handlers={{
                          handleSlippage: handlers.handleSlippage,
                          handleShowChart: handlers.handleShowChart,
                          handleTxSpeed: handlers.handleTxSpeed,
                          handleDeadline: handlers.handleDeadline,
                          handleApproveMax: handlers.handleApproveMax,
                          handleSpeedIndex: handlers.handleSpeedIndex,
                          handleResetAll: handlers.handleResetAll,
                        }}
                      />
                    ) : (
                      <Stack>
                        <Heading
                          toggleSettings={toggleSettings}
                          toggleChart={toggleChart}
                          helperModal={helperContent}
                        />
                        <TabSelect
                          index={modeIndex}
                          setIndex={setModeIndex}
                          styleIndex={[2]}
                          styleVariant="danger"
                          names={['Swap', 'Limit Buy', 'Limit Sell', 'TWAP']}
                          panels={panels}
                        />
                      </Stack>
                    )}
                  </>
                ) : (
                  trade && (
                    <SwapConfirm
                      firstToken={firstToken}
                      secondToken={secondToken}
                      setSwapConfirm={setSwapConfirm}
                      isLimit={isLimit}
                      trade={trade}
                      showInputInUSD={showInputInUSD}
                      isWrapped={isWrapped()}
                      resetInput={() => {
                        setFirstToken({
                          ...firstToken,
                          value: '',
                        });
                        setSecondToken({
                          ...secondToken,
                          value: '',
                        });
                      }}
                    />
                  )
                )}
              </SwapContainer>
              {!swapConfirm
                ? !isLimit &&
                  !showSettings && (
                    <GridItem colSpan={1}>
                      <RouteContainer showchart={+showChart}>
                        <HStack w="16">
                          <Text>Route</Text>
                          <QuestionHelper
                            title={t(`${translationPath}.route`)}
                            text={t(`${translationPath}.routeExplanation`)}
                          />
                        </HStack>

                        <HStack w="full" mt="10px" placeContent="center">
                          {defaultRoutes.map((route, index) => (
                            <HStack key={`routes-${route.address}-${index}`}>
                              <Flex
                                borderRadius="32px"
                                border={
                                  defaultRoutes.length > 3
                                    ? 'none'
                                    : '1px solid #1F2937'
                                }
                                p="4px 8px 4px 4px"
                                w="full"
                                align="center"
                                justify="center"
                              >
                                <ImageLogo symbol={route.symbol} size="24px" />
                                <Text
                                  display={
                                    defaultRoutes.length > 3
                                      ? 'none'
                                      : 'inherit'
                                  }
                                >
                                  {route.symbol}
                                </Text>
                              </Flex>
                              {defaultRoutes.length - 1 !== index ? (
                                <Icon as={ArrowRightIcon1} w="7px" />
                              ) : null}
                            </HStack>
                          ))}
                        </HStack>
                      </RouteContainer>
                    </GridItem>
                  )
                : null}
            </Box>
          </GridItem>
          <GridItem rowSpan={1} minW="100%" colSpan={1}>
            {showChart && memorizedChart()}
            {isLimit && modeIndex !== 3 ? (
              <LimitOrders showChart={showChart} />
            ) : modeIndex === 3 ? (
              <TWAPOrders />
            ) : null}
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default SwapPage;
