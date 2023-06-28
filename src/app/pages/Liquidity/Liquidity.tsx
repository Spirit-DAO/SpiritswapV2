import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  useDisclosure,
  Accordion,
  Skeleton,
  HStack,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Token,
  TokenPool,
  SobTokenPool,
  TokenAmount,
} from 'app/interfaces/General';
import { SwapState } from '../Swap/Swap.d';
import {
  StyledLiquidityWrapper,
  StyledAddLiquidity,
  StyledSection,
  StyledContainer,
  YourLiquidityWrapper,
  CollapseSection,
  StyledLiquiditySetting,
  StyledConcentratedLiqudityLabel,
} from './styles';
import { Select } from 'app/components/Select';
import { Slippage } from './components/Slippage';
import tokens, { WFTM, SPIRIT, FTM, USDC, FRAX } from 'constants/tokens';
import { ConfirmModal } from './components/ConfirmModal';
import SpiritsBackground from './components/SpiritsBackground';
import CollapseItem from './components/Collapse/Collapse';
import { CardHeader } from 'app/components/CardHeader';
import { LIQUIDITY } from 'constants/icons';
import { LIQUIDITY as LIQUIDITY_ROUTE } from 'app/router/routes';
import Settings from '../Swap/components/Settings';
import {
  pairTradingData,
  getLiquidityData,
  AddLiquidityTrade,
  AddLiquidityTradeV2,
  checkLpPairCreated,
  AddLiquidityTradeV3,
} from 'utils/web3/actions/liquidity';
import { getLiquityPoolData as getPricingData } from 'utils/data/covalent';
import { CovalentBalanceItem, tokenData } from 'utils/data';
import { RemoveLiquidityPanel } from './components/RemoveLiquidityPanel';
import {
  checkAddress,
  checkInvalidValue,
  getCircularReplacer,
  getLpAddress,
  isFTM,
} from 'app/utils';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import {
  checkAllowance,
  queryJoinPool,
  addSobLiquidity,
} from 'utils/web3/actions';
import {
  buildCheckAndApprove,
  buildAddLiquidity,
  buildEnterOnFarm,
} from 'app/components/TransactionFlow/utils/helper';
import contracts from 'constants/contracts';
import { CHAIN_ID } from 'constants/index';
import { connect, setupNetwork } from 'utils/web3';
import { filterAsync } from 'lodasync';
import { TransactionFlow } from 'app/components/TransactionFlow';
import { BASE_TOKEN_ADDRESS } from 'constants/index';
import pools from 'constants/farms';
import {
  ClassicPanel,
  StablePanel,
  WeightedPanel,
  ConcentratedPanel,
} from 'app/pages/Liquidity/components/Panels';
import { ActionButton } from './components/ActionButton';
import { Hint } from 'app/components/Hint';
import useSettings from 'app/hooks/useSettings';
import useGetGasPrice from 'app/hooks/useGetGasPrice';
import useGetTokensPrices from 'app/hooks/useGetTokensPrices';
import checkDisabled from './utils/checkDisabled';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'store/hooks';
import { selectUserSettings } from 'store/settings/selectors';
import { selectFarmMasterData } from 'store/farms/selectors';
import { useSuggestion } from 'app/hooks/Suggestions/useSuggestion';
import { SuggestionsTypes } from 'app/hooks/Suggestions/Suggestion';
import { NOT_ENOUGH_FUNDS, NON_ZERO } from 'constants/errors';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { useTokenBalance } from 'app/hooks/useTokenBalance';
import { ConnectWallet } from 'app/components/ConnectWallet';
import { selectFtmInfo } from 'store/general/selectors';
import useWallets from 'app/hooks/useWallets';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { DataContext } from 'contexts/DataContext';
import { useV3DerivedMintInfo } from 'store/v3/mint/hooks';
import { useCurrency } from 'app/hooks/v3/useCurrency';
import ConcentratedCollapseItem from './components/ConcentratedCollapse/ConcentratedCollapse';
import { RemoveConcentratedLiquidityPanel } from './components/RemoveConcentratedLiquidityPanel';
import { Heading } from 'app/components/Typography';
import { ConfirmModalConcentrated } from './components/ConfirmModalConcentrated';
import { Switch } from 'app/components/Switch';

// TODO: [DEV2-591] refactor liquidity component

const TOKEN_TYPE_CLASSIC_INDEX = 0;
const TOKEN_TYPE_CLASSIC_LABEL = 'Variable';
const TOKEN_TYPE_STABLE_INDEX = 1;
const TOKEN_TYPE_STABLE_LABEL = 'Stable';
const TOKEN_TYPE_CONCENTRATED_INDEX = 2;
const TOKEN_TYPE_CONCENTRATED_LABEL = 'Concentrated Liquidity';
const TOKEN_TYPE_WEIGHTED_INDEX = 3;
const TOKEN_TYPE_WEIGHTED_LABEL = 'Weighted';

export function LiquidityPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const pageTitle = `${t('common.name')} - ${t('common.menu.liquidity')}`;
  const { addToQueue } = Web3Monitoring();
  const translationPath = 'liquidity.common';
  const translationPathHelper = 'liquidity.helperModal';
  const { handlers, states } = useSettings();
  const { showSuggestion } = useSuggestion();
  const { token1, token2, type, positionId } = useParams();
  const { userDataWorker } = useContext(DataContext);
  const [attempt, setAttempt] = useState(false);
  const [zapDirectly, setZapDirectly] = useState(false);
  const { price: ftmPrice } = useAppSelector(selectFtmInfo);
  const { account, isLoggedIn, walletLiquidity, concentratedLiqudiity, login } =
    useWallets();
  const ROUTER_ADDRESS = contracts.router[CHAIN_ID];
  const ROUTERV2_ADDRESS = contracts.routerV2[CHAIN_ID];
  const SOB_VAULT_ADDRESS = contracts.sobVault[CHAIN_ID];
  const WEIGHTED_VAULT_ADDRESS = contracts.wVault[CHAIN_ID];
  const NONFUNGIBLE_POSITION_ADDRESS =
    contracts.v3NonfungiblePositionManager[CHAIN_ID];

  const liquidityTypeFromFarm = () => {
    if (type === 'stable') {
      return TOKEN_TYPE_STABLE_INDEX;
    }
    if (type === 'concentrated') {
      return TOKEN_TYPE_CONCENTRATED_INDEX;
    }
    return TOKEN_TYPE_CLASSIC_INDEX;
  };

  const matchesToken = tokenParam => {
    if (!tokenParam) {
      return false;
    }

    return tokens.find(token =>
      [
        `${token.symbol}`.toLowerCase(),
        `${token.address}`.toLowerCase(),
      ].includes(tokenParam.toLowerCase()),
    );
  };

  const token1FromFarm = useMemo(() => matchesToken(token1), [token1]);
  const token2FromFarm = useMemo(() => matchesToken(token2), [token2]);

  // States
  const initialState = {
    value: '',
    tokenSelected: token1FromFarm || tokens[0],
  };

  const initialState1 = {
    value: '',
    tokenSelected: token2FromFarm || tokens[1],
  };

  let matchedLpTokens;

  // If the url conrtains remove, we are dealing with a liquidity removal endpoint
  if (token1 && token2 && window.location.href.includes('/remove')) {
    matchedLpTokens = pools.filter(
      token =>
        token.lpSymbol.includes(`${token1}`) &&
        token.lpSymbol.includes(`${token2}`),
    );
  }

  const [firstToken, setFirstToken] = useState<SwapState>(initialState);
  const [secondToken, setSecondToken] = useState<SwapState>(initialState1);
  const [liquidityTrade, setLiquidityTrade] =
    useState<AddLiquidityTrade | null>(null);

  const [nonClassicTrade, setNonClassicTrade] =
    useState<AddLiquidityTradeV2 | null>(null);

  const [concentratedLiquidityTrade, setConcentratedLiquidityTrade] =
    useState<AddLiquidityTradeV3 | null>(null);

  const [pricingData, setPricingData] = useState<CovalentBalanceItem | null>(
    null,
  );

  const [tokenPoolSelected, setTokenPoolSelected] = useState<
    TokenPool | SobTokenPool | undefined
  >(undefined);
  const [tokensOfPoolInputValue, setTokensOfPoolInputValue] = useState({});

  const [weightedPoolSelected, setWeightedPoolSelected] = useState<
    TokenPool | SobTokenPool | undefined
  >(undefined);
  const [weightedPoolInputValue, setWeightedPoolInputValue] = useState({});
  const [showRemoveLiquidiy, setshowRemoveLiquidiy] = useState(false);
  const [generalInputState] = useState('0');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConcentratedConfirmModal, setShowConcentratedConfirmModal] =
    useState(false);
  const [LPTokenToRemove, setLPTokenToRemove] = useState<tokenData>();
  const [concentratedPositionToRemove, setConcentratedPositionToRemove] =
    useState<any>();
  const [pairNotCreated, setPairNotCreated] = useState<boolean>(false);
  const [poolData, setPoolData] = useState<any>({});
  const [altPoolData, setAltPoolData] = useState<any>({});
  const [showClosed, setShowClosed] = useState(false);

  const { token: tokenOneBalance } = useTokenBalance(
    CHAIN_ID,
    liquidityTrade?.tokenA?.address ?? firstToken.tokenSelected.address,
    'token',
    firstToken.tokenSelected,
  );
  const { token: tokenTwoBalance } = useTokenBalance(
    CHAIN_ID,
    liquidityTrade?.tokenB?.address ?? secondToken.tokenSelected.address,
    'token',
    secondToken.tokenSelected,
  );

  const { tokensPrices } = useGetTokensPrices({
    tokenAddresses: [tokenOneBalance.address, tokenTwoBalance.address],
  });

  const tokenOnePrice = useMemo(() => {
    const keys = Object.keys(tokensPrices ?? {});
    if (firstToken.tokenSelected.symbol === 'FTM') {
      return ftmPrice;
    }
    let tokenKey;
    if (tokensPrices && keys.length > 0) {
      tokenKey = keys.find(key => {
        return (
          key &&
          checkAddress(
            tokensPrices[key].address,
            firstToken.tokenSelected.address,
          )
        );
      });

      return tokensPrices[tokenKey] ? tokensPrices[tokenKey].rate : '0';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstToken.tokenSelected.address, ftmPrice, tokensPrices]);

  const tokenTwoPrice = useMemo(() => {
    const keys = Object.keys(tokensPrices ?? {});
    if (secondToken.tokenSelected.symbol === 'FTM') {
      return ftmPrice;
    }
    let tokenKey;
    if (tokensPrices && keys.length > 0) {
      tokenKey = keys.find(key => {
        return (
          key &&
          checkAddress(
            tokensPrices[key].address,
            secondToken.tokenSelected.address,
          )
        );
      });

      return tokensPrices[tokenKey] ? tokensPrices[tokenKey].rate : '0';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondToken.tokenSelected.address, ftmPrice, tokensPrices]);

  const { notifications } = useAppSelector(selectUserSettings);
  const dispatch = useDispatch();
  const farmData = useAppSelector(selectFarmMasterData);

  const baseCurrency = useCurrency(firstToken?.tokenSelected?.address);
  const currencyB = useCurrency(secondToken?.tokenSelected?.address);

  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.equals(currencyB)
      ? undefined
      : currencyB;

  const mintInfo = useV3DerivedMintInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    100,
    baseCurrency ?? undefined,
    undefined,
  );

  const [tokensNeedingApprove, setTokensNeedingApprove] = useState<
    TokenAmount[]
  >([]);

  const [pairStatus, setPairStatus] = useState({
    pairAddress: '',
    altPairAddress: '',
    pairIsCreated: false,
    lpSymbol: '',
  });

  const [canApproveFunds, setCanApproveFunds] = useState<{
    canApprove: boolean;
    msg: string | null;
    relevantTokens: string[] | null;
  }>({
    canApprove: false,
    msg: '',
    relevantTokens: [],
  });
  const { isOpen, onOpen: onOpenTransactionFlow, onClose } = useDisclosure();
  const {
    isOpen: isOpenConnect,
    onOpen: onOpenConnect,
    onClose: onCloseConnect,
  } = useDisclosure();
  const [tokenTypeFilter, setTokenTypeFilter] = useState(liquidityTypeFromFarm);
  const isStableSelected = tokenTypeFilter === TOKEN_TYPE_STABLE_INDEX;
  const isWeightedSelected = tokenTypeFilter === TOKEN_TYPE_WEIGHTED_INDEX;
  const isConcentratedSelected =
    tokenTypeFilter === TOKEN_TYPE_CONCENTRATED_INDEX;

  const [inputErrors, setInputErrors] = useState({
    [TOKEN_TYPE_CLASSIC_INDEX]: undefined,
    [TOKEN_TYPE_STABLE_INDEX]: undefined,
    [TOKEN_TYPE_WEIGHTED_INDEX]: undefined,
  });

  const updateInputError = (indexType, message) => {
    setInputErrors({
      ...inputErrors,
      [indexType]: message,
    });
  };

  const setWeightedInputError = message =>
    updateInputError(TOKEN_TYPE_WEIGHTED_INDEX, message);

  // Handle behaviour when user logouts
  useEffect(() => {
    resetPanel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, account]);

  useEffect(() => {
    const init = () => {
      if (
        matchedLpTokens &&
        matchedLpTokens.length &&
        walletLiquidity &&
        walletLiquidity.length
      ) {
        let lpMatch;

        for (let x = 0; x < matchedLpTokens.length; x += 1) {
          const option = matchedLpTokens[x];
          if (!lpMatch && walletLiquidity.length) {
            [lpMatch] = walletLiquidity.filter(
              item =>
                `${item.address}`.toLowerCase() ===
                `${option.lpAddresses[CHAIN_ID]}`.toLowerCase(),
            );
          }

          if (lpMatch) {
            break;
          }
        }

        if (lpMatch) {
          setLPTokenToRemove(lpMatch);
          setshowRemoveLiquidiy(true);
        }
      }

      if (
        positionId &&
        window.location.href.includes('/remove') &&
        concentratedLiqudiity &&
        concentratedLiqudiity.length
      ) {
        const positionToRemove = concentratedLiqudiity.find(
          position =>
            !position.eternalFarming && position.tokenId === Number(positionId),
        );

        if (positionToRemove) {
          setConcentratedPositionToRemove(positionToRemove);
          setshowRemoveLiquidiy(true);
        }
      }
    };
    init();
  }, [matchedLpTokens, walletLiquidity, positionId, concentratedLiqudiity]);

  useEffect(() => {
    if (tokenPoolSelected) {
      let newTokensOfPoolInuputValue = {};
      tokenPoolSelected?.tokens.forEach((token: Token) => {
        newTokensOfPoolInuputValue = {
          ...newTokensOfPoolInuputValue,
          [token.symbol]: generalInputState,
        };
      });
      setTokensOfPoolInputValue(() => newTokensOfPoolInuputValue);
    }

    if (weightedPoolSelected) {
      let newWeightedPoolInputValue = {};
      weightedPoolSelected?.tokens.forEach((token: Token) => {
        newWeightedPoolInputValue = {
          ...newWeightedPoolInputValue,
          [token.symbol]: generalInputState,
        };
      });
      setWeightedPoolInputValue(() => newWeightedPoolInputValue);
    }
  }, [tokenPoolSelected, weightedPoolSelected, generalInputState]);

  useEffect(() => {
    setTokenPoolSelected(undefined);
  }, []);

  const firstIsA = checkAddress(
    firstToken.tokenSelected.address,
    liquidityTrade?.tokenA.address ?? '',
  );

  const lpTokenValue =
    pricingData && liquidityTrade
      ? (pricingData.quote_rate * +liquidityTrade.liquidity).toFixed(2)
      : tokenOnePrice && tokenTwoPrice
      ? (
          tokenOnePrice *
            Number(
              firstIsA ? liquidityTrade?.amountA : liquidityTrade?.amountB,
            ) +
          tokenTwoPrice *
            Number(firstIsA ? liquidityTrade?.amountB : liquidityTrade?.amountA)
        ).toFixed(2)
      : '0';

  const addLiquiditySlipArray = [
    {
      id: 2,
      slippageName: t(`${translationPath}.poolShare`),
      slippageValue: liquidityTrade ? liquidityTrade.ownership : '-',
    },
    {
      id: 3,
      slippageName: t(`${translationPath}.poolValue`),
      slippageValue: `$${(
        parseFloat(lpTokenValue || '0') || '0'
      ).toLocaleString('en-us', { maximumFractionDigits: 2 })}`,
    },
    {
      id: 4,
      slippageName: t(`${translationPath}.APR`),
      slippageValue: `${poolData?.apr || '0'}%`,
    },
    {
      id: 5,
      slippageName: t(`${translationPath}.slippageTolerance`),
      slippageValue: '0.1%', // TODO: add a settings button
    },
  ];

  const showRemoveLiquidity = (LPPair: tokenData) => {
    setLPTokenToRemove(LPPair);
    setshowRemoveLiquidiy(true);
  };

  const showRemoveConcentratedLiquidity = (position: any) => {
    setConcentratedPositionToRemove(position);
    setshowRemoveLiquidiy(true);
  };

  const hideRemoveLiquidity = (_reset = false) => {
    setshowRemoveLiquidiy(false);
    navigate(`/${LIQUIDITY_ROUTE.path}`);
  };

  const { isLoading, loadingOff, loadingOn } = UseIsLoading();

  const lpAddress = getLpAddress(
    liquidityTrade?.tokenA.address ?? '',
    liquidityTrade?.tokenB.address ?? '',
  );
  const handleConfirmAddLiquidity = async () => {
    try {
      if (tokensNeedingApprove.length > 0 || zapDirectly) {
        onOpenTransactionFlow();
      } else {
        const finalStep = steps[steps.length - 1];

        loadingOn();

        const suggestion = {
          type: SuggestionsTypes.LIQUIDITY,
          id: `Suggestion-${LIQUIDITY}`,
          data: {
            farmExist: lpAddress,
            lpAddress: lpAddress,
          },
        };

        if (finalStep.action) {
          await finalStep.fn({
            params: finalStep.params,
            action: finalStep.action,
            index: steps.length - 1,
            steps,
            setSteps,
            notifications,
            suggestion,
            addToQueue,
            dispatch,
            force: true,
          });
        } else {
          await finalStep.fn({
            ...finalStep.params,
            index: steps.length - 1,
            steps,
            setSteps,
            notifications,
            suggestion,
            addToQueue,
            dispatch,
            force: true,
          });
        }

        const { provider } = await connect({ _connection: 'rpc' });

        userDataWorker.postMessage({
          userAddress: account,
          type: 'fetchIndividualLP',
          params: {
            token0: liquidityTrade?.tokenA.address,
            token1: liquidityTrade?.tokenB.address,
            stable: isStableSelected,
          },
          provider: JSON.stringify(provider, getCircularReplacer()),
        });

        userDataWorker.postMessage({
          userAddress: account,
          type: 'getV3Liquidity',
          provider: JSON.stringify(provider, getCircularReplacer()),
        });

        loadingOff();
        resetPanel();
      }
    } catch (error) {
      console.error('ERROR EN LIQUIDITY');
      setShowConfirmModal(false);
      setShowConcentratedConfirmModal(false);
    }
  };

  const handleCancelConfirmModal = () => {
    setShowConfirmModal(false);
    setShowConcentratedConfirmModal(false);
  };

  const handleTokenTypeSelect = type => {
    setTokenTypeFilter(() => type.index);
    // Idx for stable page
    if (
      type.index === 1 &&
      isFTM(firstToken.tokenSelected.address) &&
      checkAddress(secondToken.tokenSelected.address, SPIRIT.address)
    ) {
      setFirstToken({
        tokenSelected: USDC,
        value: '',
      });
      setSecondToken({
        tokenSelected: FRAX,
        value: '',
      });
    }

    if (
      type.index === 0 &&
      checkAddress(firstToken.tokenSelected.address, USDC.address) &&
      checkAddress(secondToken.tokenSelected.address, FRAX.address)
    ) {
      setFirstToken({
        tokenSelected: FTM,
        value: '',
      });
      setSecondToken({
        tokenSelected: SPIRIT,
        value: '',
      });
    }
    setSteps([]);
    setWeightedPoolSelected(undefined);
    setTokenPoolSelected(undefined);
    setNonClassicTrade(null);
    setConcentratedLiquidityTrade(null);
  };

  const updatePricingData = async (_lpAddress: string) => {
    let lpAddress = _lpAddress;

    if (!lpAddress && liquidityTrade) {
      lpAddress = liquidityTrade.lpAddress;
    }

    const pricing = await getPricingData(lpAddress);

    setPricingData(pricing);
  };

  const {
    isLoading: ipLoading,
    loadingOff: ipLoadOff,
    loadingOn: ipLoadOn,
  } = UseIsLoading();

  const {
    isLoading: opLoading,
    loadingOff: opLoadOff,
    loadingOn: opLoadOn,
  } = UseIsLoading();

  const resetPanel = () => {
    setAttempt(false);
    setLiquidityTrade(null);
    setNonClassicTrade(null);
    setConcentratedLiquidityTrade(null);
    setShowConfirmModal(false);
    setShowConcentratedConfirmModal(false);
    setshowRemoveLiquidiy(false);
    setWeightedPoolInputValue({});
    setTokensOfPoolInputValue({});
    setFirstToken({ ...firstToken, value: '' });
    setSecondToken({ ...secondToken, value: '' });
    setCanApproveFunds({
      canApprove: canApproveFunds.canApprove,
      msg: '',
      relevantTokens: [],
    });
  };

  useEffect(() => {
    const init = async () => {
      const curPair = pairStatus.pairAddress;
      const { pairAddress, pairIsCreated, lpSymbol, altPairAddress } =
        await checkLpPairCreated({
          tokenA: firstToken.tokenSelected,
          tokenB: secondToken.tokenSelected,
          isV2: true,
          isStable: isStableSelected,
        });
      setPairStatus({
        altPairAddress,
        pairAddress,
        pairIsCreated,
        lpSymbol,
      });
      setPairNotCreated(!pairIsCreated);
      if (curPair !== pairAddress) {
        resetPanel();
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    firstToken.tokenSelected,
    secondToken.tokenSelected,
    tokenTypeFilter,
    walletLiquidity,
  ]);

  const handleChangeInput = async (value, type: number) => {
    setAttempt(false);

    const token1Decimals = firstToken.tokenSelected.decimals || 18;
    const token2Decimals = secondToken.tokenSelected.decimals || 18;
    const slippageNumber = parseFloat(states.slippage) * 100;
    const balanceOne = tokenOneBalance.amount;
    const balanceTwo = tokenTwoBalance.amount;

    let params = {
      sellToken: firstToken.tokenSelected,
      buyToken: secondToken.tokenSelected,
      sellAmount: pairStatus.pairIsCreated
        ? '0'
        : `${parseUnits(firstToken.value || '0', token1Decimals)}`,
      buyAmount: pairStatus.pairIsCreated
        ? '0'
        : `${parseUnits(secondToken.value || '0', token2Decimals)}`,
      pairAddress: '',
    };

    params.pairAddress = pairStatus.pairAddress;

    if (!type) {
      pairStatus.pairIsCreated && opLoadOn();
      setFirstToken({ ...firstToken, value });
      params.sellAmount = `${parseUnits(value || '0', token1Decimals)}`;
    } else {
      pairStatus.pairIsCreated && ipLoadOn();
      setSecondToken({ ...secondToken, value });
      params.buyAmount = `${parseUnits(value || '0', token2Decimals)}`;
    }

    const response = await pairTradingData(params, true);

    const tx = response?.tx;
    const pairData = response?.pairData;

    if (!tx) {
      // If tx is undefined = pool not created, execute the corresponding logic to create it.
      const liquidityData = await getLiquidityData(
        pairData,
        pairStatus.pairAddress,
        pairStatus.lpSymbol,
        firstToken.tokenSelected,
        secondToken.tokenSelected,
        `${formatUnits(params.sellAmount, token1Decimals) || 0}`,
        `${formatUnits(params.buyAmount, token2Decimals) || 0}`,
        balanceOne,
        balanceTwo,
        `${gasPrice}`,
        slippageNumber,
        CHAIN_ID,
        true,
        tokenTypeFilter === TOKEN_TYPE_STABLE_INDEX,
      );

      if (
        parseFloat(liquidityData.amountA) === 0 &&
        parseFloat(liquidityData.amountB) === 0
      ) {
        opLoadOff();
        ipLoadOff();
        return;
      }

      return setLiquidityTrade(liquidityData);
    }

    if (tx && parseFloat(tx.buyAmount) > 0 && parseFloat(tx.sellAmount) > 0) {
      if (!type) {
        setSecondToken({
          ...secondToken,
          value: `${formatUnits(tx.buyAmount, token2Decimals)}`,
        });
      } else {
        setFirstToken({
          ...firstToken,
          value: `${formatUnits(tx.sellAmount, token1Decimals)}`,
        });
      }
      if (!balanceOne || !balanceTwo) {
        //TODO: Define proper action for no balance of selected tokens
      }

      const liquidityData = await getLiquidityData(
        pairData,
        pairStatus.pairAddress,
        pairStatus.lpSymbol,
        firstToken.tokenSelected,
        secondToken.tokenSelected,
        `${formatUnits(tx.sellAmount, token1Decimals) || 0}`,
        `${formatUnits(tx.buyAmount, token2Decimals) || 0}`,
        balanceOne,
        balanceTwo,
        `${gasPrice}`,
        slippageNumber,
        CHAIN_ID,
        true,
        tokenTypeFilter === TOKEN_TYPE_STABLE_INDEX,
      );

      if (
        parseFloat(liquidityData.amountA) === 0 &&
        parseFloat(liquidityData.amountB) === 0
      ) {
        opLoadOff();
        ipLoadOff();
        return;
      }

      if (!type) {
        opLoadOff();
      } else {
        ipLoadOff();
      }

      if (liquidityData) {
        updatePricingData(liquidityData?.lpAddress);
      }
      return setLiquidityTrade(liquidityData);
    } else {
      opLoadOff();
      ipLoadOff();
    }
  };

  useEffect(() => {
    if (liquidityTrade) {
      if (
        farmData &&
        (liquidityTrade?.lpAddress || pairStatus.altPairAddress)
      ) {
        [liquidityTrade.lpAddress, pairStatus.altPairAddress].forEach(
          async (lpAddress, i) => {
            const match = farmData.find(
              farm =>
                checkAddress(
                  `${farm?.lpAddress || farm?.address}`,
                  `${lpAddress}`.toLowerCase(),
                ) && farm?.gaugeAddress,
            );

            if (i === 0) {
              return setPoolData(match);
            }

            return setAltPoolData(match);
          },
        );
      } else {
        setPoolData({});
        setAltPoolData({});
      }

      const liquidityTradeA = parseFloat(
        firstIsA ? liquidityTrade.amountA : liquidityTrade.amountB,
      );
      const liquidityTradeB = parseFloat(
        firstIsA ? liquidityTrade.amountB : liquidityTrade.amountA,
      );
      const balanceOne = firstIsA
        ? tokenOneBalance.amount
        : tokenTwoBalance.amount;
      const balanceTwo = firstIsA
        ? tokenTwoBalance.amount
        : tokenOneBalance.amount;

      const relevantTokens: string[] = [];

      if (
        (liquidityTradeA && liquidityTradeB) ||
        checkDisabled(firstToken, secondToken, balanceOne, balanceTwo)
      ) {
        if (liquidityTradeA > balanceOne) {
          relevantTokens.push(firstToken.tokenSelected.symbol);
        }
        if (liquidityTradeB > balanceTwo) {
          relevantTokens.push(secondToken.tokenSelected.symbol);
        }
        if (relevantTokens.length > 0) {
          return setCanApproveFunds({
            canApprove: false,
            msg: NOT_ENOUGH_FUNDS,
            relevantTokens,
          });
        }
      }

      return setCanApproveFunds({
        canApprove: true,
        msg: '',
        relevantTokens: [],
      });
    }
    return setCanApproveFunds({
      canApprove: false,
      msg: '',
      relevantTokens: [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    liquidityTrade,
    firstToken.tokenSelected.symbol,
    secondToken.tokenSelected.symbol,
    tokenOneBalance,
    tokenTwoBalance,
  ]);

  const handleChangeToken = (
    tokenSelected: Token,
    type: number,
    onClose?: () => void,
    lpType?: string,
  ) => {
    if (!tokenSelected) {
      return null;
    }

    if (!type) {
      if (
        tokenSelected.address !== firstToken.tokenSelected.address &&
        tokenSelected.address !== secondToken.tokenSelected.address
      ) {
        if (isConcentratedSelected) {
          if (
            (tokenSelected.address === BASE_TOKEN_ADDRESS &&
              secondToken.tokenSelected.address === WFTM.address) ||
            (tokenSelected.address === WFTM.address &&
              secondToken.tokenSelected.address === BASE_TOKEN_ADDRESS)
          ) {
            return null;
          }
        }
        setFirstToken({ ...firstToken, tokenSelected });
      }
    } else {
      if (
        tokenSelected.address !== firstToken.tokenSelected.address &&
        tokenSelected.address !== secondToken.tokenSelected.address
      ) {
        if (isConcentratedSelected) {
          if (
            (tokenSelected.address === BASE_TOKEN_ADDRESS &&
              firstToken.tokenSelected.address === WFTM.address) ||
            (tokenSelected.address === WFTM.address &&
              firstToken.tokenSelected.address === BASE_TOKEN_ADDRESS)
          ) {
            return null;
          }
        }

        setSecondToken({ ...secondToken, tokenSelected });
      }
    }
    if (onClose) onClose();
  };

  const parsedAmount = liquidityTrade
    ? {
        [liquidityTrade.tokenA.symbol]: liquidityTrade.amountA,
        [liquidityTrade.tokenB.symbol]: liquidityTrade.amountB,
      }
    : {};

  const selectedTokensWithValue = useCallback(() => {
    if (isConcentratedSelected) {
      return [
        {
          token: {
            address: firstToken.tokenSelected.address,
            symbol: firstToken.tokenSelected.symbol,
            decimals: firstToken.tokenSelected.decimals,
            name: firstToken.tokenSelected.name,
            chainId: firstToken.tokenSelected.chainId,
          } as Token,
          amount: '2',
        },
        {
          token: {
            address: secondToken.tokenSelected.address,
            symbol: secondToken.tokenSelected.symbol,
            decimals: secondToken.tokenSelected.decimals,
            name: secondToken.tokenSelected.name,
            chainId: secondToken.tokenSelected.chainId,
          } as Token,
          amount: '2',
        },
      ];
    } else if (!isWeightedSelected && liquidityTrade) {
      return [
        { token: liquidityTrade.tokenA, amount: liquidityTrade.amountA },
        { token: liquidityTrade.tokenB, amount: liquidityTrade.amountB },
      ];
    } else if (isWeightedSelected) {
      const tps = weightedPoolSelected?.tokens as Token[];
      if (tps) {
        return tps.map(token => ({
          token,
          amount: weightedPoolInputValue[token.symbol] ?? '0',
        }));
      }
    } else {
      const tps = tokenPoolSelected?.tokens as Token[];
      if (tps) {
        return tps.map(token => {
          return {
            token,
            amount: tokensOfPoolInputValue[token.symbol] ?? '0',
          };
        });
      }
    }

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isStableSelected,
    isWeightedSelected,
    isConcentratedSelected,
    liquidityTrade,
    firstToken,
    secondToken,
    tokenPoolSelected,
    weightedPoolSelected,
    tokensOfPoolInputValue,
    weightedPoolInputValue,
  ]);

  useEffect(() => {
    setupNetwork();
  }, [
    tokensOfPoolInputValue,
    account,
    selectedTokensWithValue,
    tokenPoolSelected,
  ]);

  const liquidityToReceive = isWeightedSelected
    ? nonClassicTrade?.liquidity || 0
    : liquidityTrade?.liquidity || 0;

  const verifyAllowance = useCallback(
    async (tokenWithAmount: TokenAmount) => {
      if (
        tokenWithAmount.amount &&
        tokenWithAmount.token.address !== BASE_TOKEN_ADDRESS
      ) {
        const formattedValue = parseUnits(
          tokenWithAmount.amount,
          tokenWithAmount.token.decimals,
        );

        let approve_address = ROUTERV2_ADDRESS;

        if (isWeightedSelected) {
          approve_address = WEIGHTED_VAULT_ADDRESS;
        }

        if (isConcentratedSelected) {
          approve_address = NONFUNGIBLE_POSITION_ADDRESS;
        }

        const approvedAddLiq = await checkAllowance(
          account,
          tokenWithAmount.token.address,
          approve_address,
        );
        return approvedAddLiq.gte(formattedValue);
      } else {
        return true;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      ROUTER_ADDRESS,
      ROUTERV2_ADDRESS,
      SOB_VAULT_ADDRESS,
      WEIGHTED_VAULT_ADDRESS,
      NONFUNGIBLE_POSITION_ADDRESS,
      account,
      isWeightedSelected,
      isConcentratedSelected,
      isStableSelected,
    ],
  );

  useEffect(() => {
    const setApprovals = async () => {
      const tokensToApprove = await filterAsync(async (token: TokenAmount) => {
        const tokenAllowance = await verifyAllowance(token);
        return tokenAllowance === false;
      }, selectedTokensWithValue());

      setTokensNeedingApprove(() => tokensToApprove);
    };
    if (isLoggedIn) {
      setApprovals();
    }
  }, [
    selectedTokensWithValue,
    setTokensNeedingApprove,
    verifyAllowance,
    isLoggedIn,
  ]);

  const initialSteps = useCallback(() => {
    let approveAddress = ROUTERV2_ADDRESS;

    if (isWeightedSelected) {
      approveAddress = WEIGHTED_VAULT_ADDRESS;
    }

    if (isConcentratedSelected) {
      approveAddress = NONFUNGIBLE_POSITION_ADDRESS;
    }

    let stepNumber = 0;

    const approveSteps = selectedTokensWithValue().map(tokenAmount => {
      stepNumber++;
      return buildCheckAndApprove(
        stepNumber,
        account,
        tokenAmount,
        approveAddress,
      );
    });

    stepNumber++;

    let zapStep: any = [];

    if (zapDirectly && poolData && (liquidityTrade || nonClassicTrade)) {
      const tradeData = nonClassicTrade || liquidityTrade;

      zapStep = [
        buildCheckAndApprove(
          stepNumber + 1,
          account,
          {
            token: {
              ...poolData,
              address: poolData.lpAddress,
              symbol: `${poolData.title.replace(' + ', '-')} ${
                poolData.type === 'stable' ? 'sLP' : 'vLP'
              }`,
            },
            amount: `${tradeData?.exactLiquidity}`,
          },
          poolData.gaugeAddress,
        ),
        buildEnterOnFarm(stepNumber + 2, poolData.gaugeAddress, {
          token: poolData,
          amount: `${tradeData?.exactLiquidity}`,
        }),
      ];
    }

    if (tokenTypeFilter === TOKEN_TYPE_STABLE_INDEX) {
      return [
        ...approveSteps,
        buildAddLiquidity(stepNumber, account, liquidityTrade, true, 0, true),
        ...zapStep,
      ];
    }

    if (tokenTypeFilter === TOKEN_TYPE_WEIGHTED_INDEX) {
      const tradeParams = {
        pool: (tokenTypeFilter === TOKEN_TYPE_WEIGHTED_INDEX
          ? weightedPoolSelected
          : tokenPoolSelected) as SobTokenPool,
        tokensWithValue: selectedTokensWithValue(),
        account,
      };

      return [
        ...approveSteps,
        buildAddLiquidity(
          stepNumber,
          account,
          tradeParams as AddLiquidityTradeV2,
          true,
          tokenTypeFilter,
          false,
        ),
        ...zapStep,
      ];
    }

    if (tokenTypeFilter === TOKEN_TYPE_CONCENTRATED_INDEX) {
      return [
        ...approveSteps,
        buildAddLiquidity(
          stepNumber,
          account,
          concentratedLiquidityTrade,
          false,
          tokenTypeFilter,
          false,
        ),
      ];
    }

    const initialSteps = [
      ...approveSteps,
      buildAddLiquidity(
        stepNumber,
        account,
        liquidityTrade,
        true,
        tokenTypeFilter,
        false,
      ),
      ...zapStep,
    ];
    return initialSteps;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, liquidityTrade, concentratedLiquidityTrade, zapDirectly]);

  const [steps, setSteps] = useState<any>([]);
  const [checkQuery, setCheckQuery] = useState(false);

  useEffect(() => {
    if (selectedTokensWithValue().length > 0) {
      setSteps(initialSteps());
    }
  }, [firstToken, secondToken, initialSteps, selectedTokensWithValue]);

  const { gasPrice, txGweiCost } = useGetGasPrice({ speed: states.txSpeed });
  const [showSettings, setShowSettings] = useState<boolean>(false);

  useEffect(() => {
    setCheckQuery(true);
  }, [selectedTokensWithValue]);

  useEffect(() => {
    const [action] = steps.filter(step => step?.type === 'liquidity');
    const [pool, tokensWithAmounts, account] = action?.params || [];
    const queryJoin = async () => {
      loadingOn();

      if (action.params) {
        const query = await queryJoinPool(pool, tokensWithAmounts, account);
        setNonClassicTrade(query);
        loadingOff();
      }
    };

    const queryBatchSwap = async () => {
      loadingOff();
      const query: any = await addSobLiquidity(
        pool,
        tokensWithAmounts,
        account,
        'query',
      );

      if (query?.trade) {
        setNonClassicTrade(query.trade as AddLiquidityTradeV2);
      }
      loadingOff();
    };

    const amounts = selectedTokensWithValue();
    let hasAllBalances = true;

    amounts.forEach(balance => {
      if (!balance.amount || Number(balance.amount) === 0) {
        hasAllBalances = false;
      }
    });

    if (checkQuery && hasAllBalances && steps && steps.length) {
      if (
        tokenTypeFilter === TOKEN_TYPE_WEIGHTED_INDEX &&
        pool?.type === 'weighted'
      ) {
        queryJoin();
      }

      if (
        tokenTypeFilter === TOKEN_TYPE_STABLE_INDEX &&
        pool?.type === 'stable'
      ) {
        queryBatchSwap();
      }

      setCheckQuery(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenTypeFilter, steps, checkQuery]);

  const getLiquidityTitle = () => {
    const poolsLabel = 'Pools';
    const defaultTitle = 'Add liquidity';
    switch (tokenTypeFilter) {
      case TOKEN_TYPE_CLASSIC_INDEX:
        return defaultTitle;
      case TOKEN_TYPE_STABLE_INDEX:
        return tokenPoolSelected
          ? `${TOKEN_TYPE_STABLE_LABEL} ${poolsLabel}`
          : defaultTitle;
      case TOKEN_TYPE_WEIGHTED_INDEX:
        return weightedPoolSelected
          ? `${TOKEN_TYPE_WEIGHTED_LABEL} ${poolsLabel}`
          : defaultTitle;
      default:
        return defaultTitle;
    }
  };

  const removeLiquidity = () =>
    concentratedPositionToRemove ? (
      <RemoveConcentratedLiquidityPanel
        position={concentratedPositionToRemove}
        onCancel={hideRemoveLiquidity}
      />
    ) : (
      <RemoveLiquidityPanel
        onCancel={hideRemoveLiquidity}
        LpPair={LPTokenToRemove!}
      />
    );

  const confirmModal = () => (
    <ConfirmModal
      onConfirm={handleConfirmAddLiquidity}
      onCancel={handleCancelConfirmModal}
      parsedAmounts={parsedAmount}
      tokensWithValue={selectedTokensWithValue()?.reverse()}
      price={liquidityToReceive || '0'}
      sharePool={liquidityTrade ? liquidityTrade.ownership : '-'}
      isWeightedPool={tokenTypeFilter === TOKEN_TYPE_WEIGHTED_INDEX}
      poolName={
        tokenTypeFilter === TOKEN_TYPE_WEIGHTED_INDEX
          ? weightedPoolSelected?.name
          : liquidityTrade?.lpSymbol
      }
      isLoading={isLoading}
      zapDirectly={zapDirectly}
      setZapDirectly={setZapDirectly}
      poolData={poolData}
    />
  );

  const concentratedConfirmModal = () => (
    <ConfirmModalConcentrated
      onConfirm={handleConfirmAddLiquidity}
      onCancel={handleCancelConfirmModal}
      mintInfo={mintInfo}
      isLoading={isLoading}
    />
  );

  const handleFinishTrasaction = () => {
    onClose();

    showSuggestion({
      type: SuggestionsTypes.LIQUIDITY,
      id: `Suggestion-${LIQUIDITY}`,
      data: {
        farmExist: lpAddress,
        lpAddress: lpAddress,
      },
    });

    ipLoadOff();
    opLoadOff();
    handleCancelConfirmModal();
    resetPanel();
  };

  const classicPanelErrorMessage = () => {
    if (canApproveFunds?.msg && attempt && account) return canApproveFunds?.msg;

    if (!account && attempt) return t(`${translationPath}.connectWallet`);

    if (attempt && !firstToken.value) return NON_ZERO;
    else return null;
  };

  const liquidityItems = useMemo(() => {
    return (
      walletLiquidity &&
      walletLiquidity
        .filter(pair => pair.title)
        .sort((a, b) => Number(b.isRouterV2) - Number(a.isRouterV2))
    );
  }, [walletLiquidity]);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{pageTitle}</title>
          {
            // TODO: add description and content
          }
          <meta name="description" content="Liquidity Page" />
        </Helmet>
      </HelmetProvider>
      <Box minH="100vh" mb="30px">
        <StyledSection>
          <StyledContainer>
            <TransactionFlow
              heading={t('liquidity.common.addLiquidity1')}
              generalText={t('liquidity.common.confirmAllTransactions')}
              arrayOfSteps={steps}
              handleFinish={handleFinishTrasaction}
              onClose={onClose}
              isOpen={isOpen}
              disabled={
                !liquidityTrade &&
                !isStableSelected &&
                !isWeightedSelected &&
                !isConcentratedSelected
              }
              nextStep={() => void 0}
              notifications={notifications}
            />

            <StyledLiquidityWrapper>
              {showConfirmModal ? (
                confirmModal()
              ) : showConcentratedConfirmModal ? (
                concentratedConfirmModal()
              ) : showRemoveLiquidiy ? (
                removeLiquidity()
              ) : (
                <StyledAddLiquidity>
                  <SpiritsBackground tokenTypeFilter={tokenTypeFilter} />
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
                    <>
                      <Flex mb="spacing05" justify="space-between">
                        <CardHeader
                          title={getLiquidityTitle()}
                          id={LIQUIDITY}
                          helperContent={{
                            title: t(`${translationPath}.addLiquidity`),
                            text: t(`${translationPathHelper}.addLiquidity`),
                            showDocs: true,
                          }}
                        />
                        <StyledLiquiditySetting onClick={toggleSettings} />
                      </Flex>
                      <Select
                        labels={[
                          TOKEN_TYPE_CLASSIC_LABEL,
                          TOKEN_TYPE_STABLE_LABEL,
                          <StyledConcentratedLiqudityLabel>
                            Concentrated Liquidity
                          </StyledConcentratedLiqudityLabel>,
                          // TOKEN_TYPE_CONCENTRATED_LABEL,
                          // TOKEN_TYPE_WEIGHTED_LABEL,
                        ]}
                        selected={tokenTypeFilter}
                        onChange={handleTokenTypeSelect}
                      />

                      <Box key="box1" mt="16px" w="100%">
                        {tokenTypeFilter === TOKEN_TYPE_CLASSIC_INDEX && (
                          <ClassicPanel
                            firstToken={firstToken}
                            secondToken={secondToken}
                            ipLoading={ipLoading}
                            opLoading={opLoading}
                            lpTokenValue={checkInvalidValue(lpTokenValue)}
                            liquidityTrade={liquidityTrade}
                            handleChangeInput={handleChangeInput}
                            handleChangeToken={handleChangeToken}
                            canApproveFunds={canApproveFunds}
                            errorMessage={classicPanelErrorMessage()}
                            setCanApproveFunds={setCanApproveFunds}
                          >
                            {pairNotCreated && (
                              <Box mt="16px">
                                <Hint
                                  message={t(
                                    `${translationPath}.firstLiquidityProvider`,
                                  )}
                                  type="WARNING"
                                />
                              </Box>
                            )}
                            {altPoolData && !poolData && (
                              <Box mt="16px">
                                <Hint
                                  message={t(
                                    `${translationPath}.alternatePair`,
                                    {
                                      type:
                                        altPoolData.type === 'variable'
                                          ? 'stable'
                                          : 'variable',
                                      altType: altPoolData.type,
                                    },
                                  )}
                                  type="WARNING"
                                />
                              </Box>
                            )}
                            <ActionButton
                              handleOnClick={() => {
                                if (!isLoggedIn) {
                                  return onOpenConnect();
                                }
                                setAttempt(true);
                                if (canApproveFunds.canApprove)
                                  return setShowConfirmModal(true);
                              }}
                              isLoggedIn={isLoggedIn}
                              loading={ipLoading || opLoading}
                              message={`${
                                !isLoggedIn
                                  ? t(`${translationPath}.connectWallet`)
                                  : inputErrors[TOKEN_TYPE_CLASSIC_INDEX] ||
                                    `${t(`${translationPath}.addLiquidity`)}`
                              }`}
                            />
                          </ClassicPanel>
                        )}
                        {tokenTypeFilter === TOKEN_TYPE_STABLE_INDEX && (
                          <StablePanel
                            firstToken={firstToken}
                            secondToken={secondToken}
                            ipLoading={ipLoading}
                            opLoading={opLoading}
                            lpTokenValue={checkInvalidValue(lpTokenValue)}
                            liquidityTrade={liquidityTrade}
                            handleChangeInput={handleChangeInput}
                            handleChangeToken={handleChangeToken}
                            canApproveFunds={canApproveFunds}
                            errorMessage={classicPanelErrorMessage()}
                            setCanApproveFunds={setCanApproveFunds}
                          >
                            {pairNotCreated && (
                              <Box mt="16px">
                                <Hint
                                  message={t(
                                    `${translationPath}.firstLiquidityProvider`,
                                  )}
                                  type="WARNING"
                                />
                              </Box>
                            )}
                            <ActionButton
                              isLoggedIn={isLoggedIn}
                              loading={ipLoading || opLoading}
                              handleOnClick={() => {
                                if (!isLoggedIn) {
                                  return onOpenConnect();
                                }
                                setAttempt(true);
                                if (canApproveFunds.canApprove)
                                  return setShowConfirmModal(true);
                              }}
                              message={`${
                                !isLoggedIn
                                  ? t(`${translationPath}.connectWallet`)
                                  : inputErrors[TOKEN_TYPE_STABLE_INDEX] ||
                                    `${t(`${translationPath}.addLiquidity`)}`
                              }`}
                            />
                          </StablePanel>
                        )}
                        {tokenTypeFilter === TOKEN_TYPE_WEIGHTED_INDEX && (
                          <WeightedPanel
                            weightedPoolSelected={weightedPoolSelected}
                            setWeightedPoolSelected={setWeightedPoolSelected}
                            weightedPoolInputValue={weightedPoolInputValue}
                            setWeightedPoolInputValue={
                              setWeightedPoolInputValue
                            }
                            setInputError={setWeightedInputError}
                            weightedLpAmountToReceive={liquidityToReceive}
                            lpTokenValue={checkInvalidValue(lpTokenValue)}
                          >
                            {pairNotCreated && (
                              <Box mt="16px">
                                <Hint
                                  message={t(
                                    `${translationPath}.firstLiquidityProvider`,
                                  )}
                                  type="WARNING"
                                />
                              </Box>
                            )}
                            <ActionButton
                              isLoggedIn={isLoggedIn}
                              loading={false}
                              handleOnClick={() => setShowConfirmModal(true)}
                              isDisabled={
                                !isLoggedIn ||
                                inputErrors[TOKEN_TYPE_WEIGHTED_INDEX]
                              }
                              message={inputErrors[TOKEN_TYPE_WEIGHTED_INDEX]}
                            />
                          </WeightedPanel>
                        )}
                        {tokenTypeFilter === TOKEN_TYPE_CONCENTRATED_INDEX && (
                          <ConcentratedPanel
                            firstToken={firstToken}
                            secondToken={secondToken}
                            ipLoading={ipLoading}
                            opLoading={opLoading}
                            lpTokenValue={checkInvalidValue(lpTokenValue)}
                            liquidityTrade={liquidityTrade}
                            handleChangeInput={handleChangeInput}
                            handleChangeToken={handleChangeToken}
                            canApproveFunds={canApproveFunds}
                            errorMessage={classicPanelErrorMessage()}
                            setCanApproveFunds={setCanApproveFunds}
                          >
                            <ActionButton
                              isDisabled={Boolean(mintInfo.errorMessage)}
                              handleOnClick={() => {
                                if (!isLoggedIn) {
                                  return onOpenConnect();
                                }

                                setFirstToken({
                                  ...firstToken,
                                  value: mintInfo.parsedAmounts.CURRENCY_A
                                    ? mintInfo.parsedAmounts.CURRENCY_A.toSignificant(
                                        5,
                                      )
                                    : '',
                                });
                                setSecondToken({
                                  ...secondToken,
                                  value: mintInfo.parsedAmounts.CURRENCY_B
                                    ? mintInfo.parsedAmounts.CURRENCY_B.toSignificant(
                                        5,
                                      )
                                    : '',
                                });
                                setConcentratedLiquidityTrade({
                                  mintInfo,
                                  slippage: states.slippage,
                                  deadline: states.deadline,
                                  account,
                                });
                                setAttempt(true);
                                // if (canApproveFunds.canApprove)
                                return setShowConcentratedConfirmModal(true);
                              }}
                              isLoggedIn={isLoggedIn}
                              loading={ipLoading || opLoading}
                              message={`${
                                !isLoggedIn
                                  ? t(`${translationPath}.connectWallet`)
                                  : inputErrors[TOKEN_TYPE_CLASSIC_INDEX] ||
                                    `${t(`${translationPath}.addLiquidity`)}`
                              }`}
                            />
                          </ConcentratedPanel>
                        )}
                      </Box>
                      {/* Trading Section End */}

                      {/* Bottom Start */}
                      <Box key="box2" mt="16px">
                        {addLiquiditySlipArray.map(item => {
                          const displaySlippageData =
                            tokenTypeFilter === TOKEN_TYPE_CLASSIC_INDEX ||
                            tokenTypeFilter === TOKEN_TYPE_STABLE_INDEX ||
                            (tokenTypeFilter === TOKEN_TYPE_WEIGHTED_INDEX &&
                              weightedPoolSelected);

                          if (displaySlippageData) {
                            return (
                              <Slippage
                                key={item.id}
                                slippageName={`${item.slippageName}`}
                                slippageValue={item.slippageValue}
                                isLoading={ipLoading || opLoading}
                              />
                            );
                          } else {
                            return null;
                          }
                        })}
                      </Box>
                    </>
                  )}

                  {/* Bottom End */}
                </StyledAddLiquidity>
              )}
              {/* Add Liquidity End */}
              {/* Your Liquidity Start */}
              <YourLiquidityWrapper>
                <CollapseSection>
                  <Flex mb="spacing05" justify="space-between" maxH="200px">
                    <CardHeader
                      title="Your Liquidity"
                      id="liquidity"
                      helperContent={{
                        title: t(`${translationPath}.addLiquidity`),
                        text: t(`${translationPathHelper}.addLiquidity`),
                        showDocs: true,
                      }}
                    />
                  </Flex>
                  {isLoggedIn && walletLiquidity ? (
                    <>
                      <Box my={3}>
                        <Heading level={5}>
                          {t(`${translationPath}.lpTokens`)}
                        </Heading>
                      </Box>
                      <Box maxH="460px" overflowY="scroll">
                        <Accordion
                          defaultIndex={[-1]}
                          allowToggle
                          variant="liquidity"
                        >
                          {walletLiquidity.length > 0 ? (
                            liquidityItems?.map(pair => (
                              <CollapseItem
                                key={pair.address}
                                userAddress={account}
                                hideRemoveLiquidity={hideRemoveLiquidity}
                                handleChangeToken={handleChangeToken}
                                setLPToken={showRemoveLiquidity}
                                pair={pair}
                              />
                            ))
                          ) : (
                            <Skeleton
                              startColor="grayBorderBox"
                              endColor="bgBoxLighter"
                              w="full"
                              h="170px"
                              mb="spacing05"
                            />
                          )}
                        </Accordion>
                      </Box>
                    </>
                  ) : !walletLiquidity ? (
                    <HStack py="3" justifyContent="center">
                      <Text fontSize="h3" color="grayDarker">
                        No V2 liquidity found
                      </Text>
                      <QuestionHelper
                        title={'No V2 liquidity found'}
                        text={[
                          'You must supply liquidity to get V2 liquidity pool tokens.',
                          '⠀',
                          'V1 liquidity is not supported.',
                        ]}
                        iconWidth="20px"
                        iconMargin="0 0 5px 0"
                      />
                    </HStack>
                  ) : (
                    <VStack justifyContent="center">
                      <Text fontSize="h5" color="gray">
                        {t(`${translationPath}.connectText`)}
                      </Text>
                      <Button
                        variant="primary"
                        alignItems="center"
                        onClick={() => login()}
                      >
                        Connect wallet
                      </Button>
                    </VStack>
                  )}
                  {isLoggedIn && concentratedLiqudiity ? (
                    <>
                      <Flex my={3} align={'center'}>
                        <Heading level={5}>
                          {t(`${translationPath}.concentratedPositions`)}
                        </Heading>
                        <Switch
                          label={'Show closed'}
                          checked={showClosed}
                          onChange={() => setShowClosed(v => !v)}
                          ml={'auto'}
                        />
                      </Flex>
                      <Box maxH="460px" overflowY="scroll">
                        <Accordion
                          defaultIndex={[-1]}
                          allowToggle
                          variant="liquidity"
                        >
                          {concentratedLiqudiity.length > 0 ? (
                            concentratedLiqudiity?.map(position => (
                              <ConcentratedCollapseItem
                                key={position.tokenId}
                                position={position}
                                // userAddress={account}
                                hideRemoveLiquidity={hideRemoveLiquidity}
                                handleChangeToken={handleChangeToken}
                                showClosed={showClosed}
                                setLPToken={position => {
                                  showRemoveConcentratedLiquidity(position);
                                }}
                              />
                            ))
                          ) : (
                            <Skeleton
                              startColor="grayBorderBox"
                              endColor="bgBoxLighter"
                              w="full"
                              h="170px"
                              mb="spacing05"
                            />
                          )}
                        </Accordion>
                      </Box>
                    </>
                  ) : isLoggedIn ? (
                    <HStack py="3" justifyContent="center">
                      <Text fontSize="h3" color="grayDarker">
                        No V3 liquidity found
                      </Text>
                      <QuestionHelper
                        title={'No V3 liquidity found'}
                        text={[
                          'You must supply liquidity to get V3 Positions.',
                        ]}
                        iconWidth="20px"
                        iconMargin="0 0 5px 0"
                      />
                    </HStack>
                  ) : null}
                </CollapseSection>
              </YourLiquidityWrapper>
              {/* Your Liquidity End */}
            </StyledLiquidityWrapper>
            {/* Liquidity Title Section Start */}
          </StyledContainer>
        </StyledSection>
      </Box>
      <ConnectWallet isOpen={isOpenConnect} dismiss={onCloseConnect} />
    </>
  );
}
