import { useState, useEffect, useCallback } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { balanceReturnData, fiat, getTokenGroupStatistics } from 'utils/data';
import { Box, Button, Flex, Stack, useDisclosure } from '@chakra-ui/react';
import PartnersIcons from './PartnersIcons';
import { useNavigate } from 'app/hooks/Routing';
import {
  SwapIcon,
  FarmsIcon,
  BridgeIcon,
  InspiritIcon,
  Ape,
  Swap,
  Earn,
  Main,
  Bridge,
  Inspirit,
  Share,
} from './index';
import { ArrowRightIcon } from 'app/assets/icons';
import {
  AboutSectionItem,
  PartnersSection,
  WalletPanel,
  Portfolio,
} from './components';
import {
  Wrapper,
  ContentWrapper,
  WalletWrapper,
  WalletTitle,
  StyledWalletDescription,
  WalletButtonWrapper,
  WalletPanelWrapper,
  PortfolioWrapper,
} from './styles';
import {
  selectTokens,
  selectPortfolioValue,
  selectFarmRewards,
  selectShowPortfolio,
  selectLimitOrdersTotalValue,
} from 'store/user/selectors';
import {
  LENDANDBORROW,
  SWAP,
  FARMS,
  BRIDGE,
  INSPIRIT,
  resolveRoutePath,
} from 'app/router/routes';
import { ConnectWallet } from 'app/components/ConnectWallet';
import {
  GetInspiritData,
  isVerifiedToken,
  GetLimitOrders,
  truncateTokenValue,
} from 'app/utils';
import { selectSpiritInfo, selectTokensToShow } from 'store/general/selectors';
import { SPIRIT, SPIRIT_DOCS_URL, TOKENS_TO_SHOW } from 'constants/index';
import { setPortfolioValue, setShowPortfolio } from 'store/user';
import MiniFooter from './components/MiniFooter';
import DexStatistics from './components/DexStatistics';
import { LendAndBorrowIcon, ApeIcon } from './../../assets/icons/index';
import { GelattoLimitOrder } from 'utils/swap/types';
import { openInNewTab } from 'app/utils/redirectTab';
import useMobile from 'utils/isMobile';
import { Animation } from 'app/components/Animations';
import browser from 'browser-detect';
import {
  SwapAnimation,
  BridgeAnimation,
  InspiritAnimation,
  LandingAnimation,
  LendingAnimation,
  FarmAnimation,
} from '../../assets/animations';
import useWallets from 'app/hooks/useWallets';

const PartnerItems = [
  {
    icon: PartnersIcons.LiquidDriverIcon,
    url: 'https://www.liquiddriver.finance/',
  },
  { icon: PartnersIcons.OlafinanceIcon, url: 'https://ola.finance/' },
  { icon: PartnersIcons.CovalentIcon, url: 'https://www.covalenthq.com/' },
  {
    icon: PartnersIcons.KekToolsIcon,
    url: `https://kek.tools/t/${SPIRIT.address}`,
  },
  { icon: PartnersIcons.Unidex, url: 'https://unidex.exchange/' },
  { icon: PartnersIcons.BeefyIcon, url: 'https://beefy.finance/' },
  { icon: PartnersIcons.LiFinanceIcon, url: 'https://li.fi/' },
  { icon: PartnersIcons.GelatoIcon, url: 'https://www.gelato.network/' },
  { icon: PartnersIcons.YearnIcon, url: 'https://yearn.finance/#/home' },
  { icon: PartnersIcons.ParaSwapIcon, url: 'https://www.paraswap.io/' },
  { icon: PartnersIcons.AbracadabraIcon, url: 'https://abracadabra.money/' },
  { icon: PartnersIcons.HedgeyIcon, url: 'https://hedgey.finance/' },
  { icon: PartnersIcons.GrimIcon, url: 'https://www.grim.finance/' },
  { icon: PartnersIcons.ReaperIcon, url: 'https://www.reaper.farm/' },
  { icon: PartnersIcons.BalancerIcon, url: 'https://balancer.fi/' },
  { icon: PartnersIcons.Cre8rIcon, url: 'https://cre8r.vip/' },
  {
    icon: PartnersIcons.BowTiedIcon,
    url: 'https://thereadingape.substack.com/',
  },
  { icon: PartnersIcons.AlchemixIcon, url: 'https://alchemix.fi/' },
  { icon: PartnersIcons.NftgarageIcon, url: 'https://nftgarage.world/' },
  { icon: PartnersIcons.RevestLogoIcon, url: 'https://revest.finance/' },
  { icon: PartnersIcons.MarketXyzIcon, url: 'https://www.market.xyz/' },
];

const Home = () => {
  const { t } = useTranslation();
  const pageTitle = `${t('common.name')} - ${t('common.menu.home')}`;
  const translationPath = 'home.common';
  const navigate = useNavigate();
  const isMobile = useMobile();
  const { isLoggedIn, account, liquidity, walletLiquidity } = useWallets();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useAppDispatch();
  const { name: browserName } = browser();
  const isSafariBrowser = browserName === 'safari';

  const [tokenData, setTokenData] = useState<balanceReturnData>({
    tokenList: [],
    farmList: [],
    diffAmount: '',
    diffAmountValue: 0,
    diffPercent: '',
    diffPercentValue: 0,
    totalValue: '',
    total24Value: '',
    totalValueNumber: 0,
    total24ValueNumber: 0,
  });
  const [liquidityData, setLiquidityData] = useState<balanceReturnData>({
    farmList: [],
    diffAmount: '',
    diffAmountValue: 0,
    diffPercent: '',
    diffPercentValue: 0,
    totalValue: '',
    total24Value: '',
    totalValueNumber: 0,
    total24ValueNumber: 0,
  });
  const [limitOrdersData, setLimitOrdersData] = useState<GelattoLimitOrder[]>(
    [],
  );

  const [farmRewards, setFarmRewards] = useState(0);
  const limitOrders = GetLimitOrders();
  const showPortfolio = useAppSelector(selectShowPortfolio);
  const tokensToShow = useAppSelector(selectTokensToShow);
  const rewards = useAppSelector(selectFarmRewards);
  const tokens = useAppSelector(selectTokens);
  const limitOrdersTotalValue = useAppSelector(selectLimitOrdersTotalValue);
  const portfolioAmountValue = useAppSelector(selectPortfolioValue);
  const { price: spiritPrice } = useAppSelector(selectSpiritInfo);

  const {
    balance,
    spiritLocked,
    nextSpiritDistribution,
    spiritClaimable,
    bribesClaimable,
    lockedEnd,
    spiritLockedValue,
  } = GetInspiritData();

  const inSpiritData = {
    userLockedAmount: Number(spiritLocked),
    userLockedAmountValue: Number(spiritLockedValue),
    inSpiritBalance: Number(balance),
    userClaimableAmount: Number(spiritClaimable),
    userBribesClaimableAmount: Number(bribesClaimable),
    userLockEndDate: lockedEnd,
    nextDistribution: nextSpiritDistribution,
  };

  const AboutSectionItems = [
    {
      id: 'swap',
      titleIcon: <SwapIcon />,
      translationPath: 'home.about.swap',
      buttonNavPath: { path: SWAP.path },
      image: Swap,
      animation: SwapAnimation,
    },
    {
      id: 'farms',
      titleIcon: <FarmsIcon />,
      translationPath: 'home.about.farms',
      buttonNavPath: { path: FARMS.path },
      image: Earn,
      animation: FarmAnimation,
    },
    // {
    //   id: 'bridge',
    //   titleIcon: <BridgeIcon />,
    //   translationPath: 'home.about.bridge',
    //   buttonNavPath: { path: BRIDGE.path },
    //   image: Bridge,
    //   animation: BridgeAnimation,
    // },
    {
      id: 'inSpirit',
      titleIcon: <InspiritIcon />,
      translationPath: 'home.about.inspirit',
      buttonNavPath: { path: INSPIRIT.path },
      image: Inspirit,
      animation: InspiritAnimation,
    },
    // {
    //   id: 'lend',
    //   titleIcon: <LendAndBorrowIcon />,
    //   translationPath: 'home.about.lend',
    //   buttonNavPath: { path: LENDANDBORROW.url, targetSelf: true },
    //   image: Share,
    //   animation: LendingAnimation,
    // },
  ];

  const handleGoToLanding = () => {
    dispatch(setShowPortfolio(false));
    navigate('');
  };

  const handleConnectButton = () => {
    if (isLoggedIn) dispatch(setShowPortfolio(true));
    else onOpen();
  };

  useEffect(() => {
    if (isLoggedIn) {
      if (rewards && rewards.length) {
        const totalRewards = rewards?.reduce(
          (total, reward) => total + parseFloat(`${reward.earned}`),
          0,
        );

        setFarmRewards(totalRewards / 10 ** 18);
      }
    }
  }, [rewards, isLoggedIn]);

  useEffect(() => {
    if (!tokens?.tokenList || !liquidity || !limitOrders || !account) return;

    setLiquidityData({
      ...liquidity,
      stakeList: walletLiquidity,
    });
    setLimitOrdersData(limitOrders);

    switch (tokensToShow) {
      case TOKENS_TO_SHOW.ALL:
        const tokensList_0: any = tokens.tokenList
          .map(token => token.originalItem)
          .filter(item => item);

        const response_0 = getTokenGroupStatistics(tokensList_0, 'tokenList');

        dispatch(
          setPortfolioValue(
            response_0.totalValueNumber + liquidity.totalValueNumber,
          ),
        );
        return setTokenData(response_0);
      case TOKENS_TO_SHOW.VERIFIED:
        const tokenList: any = tokens.tokenList
          .map(token => isVerifiedToken(token.address) && token.originalItem)
          .filter(item => item);

        const response = getTokenGroupStatistics(tokenList ?? [], 'tokenList');

        dispatch(
          setPortfolioValue(
            response.totalValueNumber + liquidity.totalValueNumber,
          ),
        );
        return setTokenData(response);
      case TOKENS_TO_SHOW.UNVERIFIED:
        const tokenList_1: any = tokens.tokenList
          .map(token => !isVerifiedToken(token.address) && token.originalItem)
          .filter(item => item);

        const response_1 = getTokenGroupStatistics(tokenList_1, 'tokenList');

        dispatch(
          setPortfolioValue(
            response_1.totalValueNumber + liquidity.totalValueNumber,
          ),
        );
        return setTokenData(response_1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensToShow, tokens, account, liquidity, dispatch, limitOrders]);

  const portfolioAmount =
    portfolioAmountValue +
    inSpiritData.userLockedAmount * spiritPrice +
    limitOrdersTotalValue;

  const landingAnimation = useCallback(() => {
    return (
      <Box mt="15vh">
        {isMobile ? <img src={Main} alt="spirit-logo" /> : null}
      </Box>
    );
  }, [isMobile]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content="A Boilerplate application home" />
        </Helmet>
      </HelmetProvider>
      <Wrapper>
        <ContentWrapper>
          {isLoggedIn && showPortfolio ? (
            <PortfolioWrapper>
              <Portfolio
                translationPath="home.portfolio"
                amount={fiat(portfolioAmount)}
                tokensData={tokenData}
                liquidityData={liquidityData}
                inSpiritData={inSpiritData}
                limitOrdersData={limitOrdersData}
                onClickLandingButton={handleGoToLanding}
              />
            </PortfolioWrapper>
          ) : (
            <>
              <WalletWrapper isMobile={isMobile}>
                <div></div>
                <ConnectWallet isOpen={isOpen} dismiss={onClose} />
                <Stack direction={isMobile ? 'column' : 'row'}>
                  {landingAnimation()}
                  <Flex direction="column">
                    <WalletTitle level={1}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: t(`${translationPath}.header`),
                        }}
                      />
                    </WalletTitle>
                    <StyledWalletDescription level={3}>
                      {isMobile || isLoggedIn ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: t(`${translationPath}.description`),
                          }}
                        />
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: t(`${translationPath}.descriptionFull`),
                          }}
                        />
                      )}
                    </StyledWalletDescription>

                    <WalletButtonWrapper>
                      <Button
                        onClick={handleConnectButton}
                        rightIcon={<ArrowRightIcon w="22px" color="white" />}
                      >
                        {isLoggedIn
                          ? t(`${translationPath}.showPortfolio`)
                          : t(`${translationPath}.connectWallet`)}
                      </Button>
                      <Button
                        variant="inverted"
                        onClick={() => openInNewTab(SPIRIT_DOCS_URL)}
                      >
                        {t(`${translationPath}.learnMore`)}
                      </Button>
                    </WalletButtonWrapper>
                    {isLoggedIn && (
                      <WalletPanelWrapper>
                        <WalletPanel
                          title={t(`${translationPath}.walletBalance`)}
                          amount={truncateTokenValue(portfolioAmount)}
                          buttonTitle={
                            portfolioAmount
                              ? t(`${translationPath}.swapTokens`)
                              : t(`${translationPath}.bridgeTokens`)
                          }
                          onButtonClick={
                            portfolioAmount
                              ? () => navigate(SWAP.path)
                              : () => navigate(BRIDGE.path)
                          }
                        />
                        <WalletPanel
                          title={t(`${translationPath}.farmRewards`)}
                          amount={truncateTokenValue(
                            farmRewards * spiritPrice,
                            spiritPrice,
                          )}
                          buttonTitle={t(`${translationPath}.showFarms`)}
                          onButtonClick={() => navigate(FARMS.path)}
                        />
                      </WalletPanelWrapper>
                    )}
                  </Flex>

                  <Box h="100%" w="100%">
                    {!isMobile ? (
                      isSafariBrowser ? (
                        <img src={Main} alt="SpiritSwap icon" />
                      ) : (
                        Animation(LandingAnimation, Main)
                      )
                    ) : null}
                  </Box>
                </Stack>
                <MiniFooter />
              </WalletWrapper>

              <DexStatistics />

              <Flex px="16px" direction="column" alignItems="center">
                {AboutSectionItems.map((item, index) => (
                  <AboutSectionItem
                    index={index}
                    key={`${item.id}`}
                    {...item}
                  />
                ))}

                <PartnersSection
                  isMobile={isMobile}
                  partnerItems={PartnerItems}
                />
              </Flex>
            </>
          )}
        </ContentWrapper>
      </Wrapper>
    </>
  );
};

export default Home;
