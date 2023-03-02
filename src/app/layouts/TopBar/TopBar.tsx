import { FC, useEffect, useCallback, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'app/hooks/Routing';
import { useTranslation } from 'react-i18next';
import { NavigationDropdown } from 'app/components/NavigationDropdown';
import { ConnectWallet } from 'app/components/ConnectWallet';
import {
  Box,
  HStack,
  useDisclosure,
  Button,
  Text,
  Image,
  Skeleton,
  useMediaQuery,
} from '@chakra-ui/react';
import Metamask from 'app/assets/wallets/metamask.png';
import useLogin from 'app/connectors/EthersConnector/login';
import {
  WalletIcon,
  SettingsIcon,
  SoullyIcon,
  SpiritDesktopIcon,
  SpiritMobileIcon,
  WalletExitIcon,
  MartialArtsSwordFencingIcon,
} from 'app/assets/icons';

import type {
  navDropdownMenusType,
  NavMenuProps,
  navMenusType,
  Props,
} from './TopBar.d';
import {
  ContentWrapper,
  TopWrapper,
  StyledTokenInfoBar,
  BottomWrapper,
  MenuWrapper,
  MenuButton,
  MoreButtonWrapper,
  MoreButton,
  CaretDownImage,
  NavDropdownWrapper,
  StyledSettingsModal,
  MoneyHandIcon,
  BridgeIcon,
  SwapIcon,
  FarmsIcon,
  HomeIcon,
  InSpiritIcon,
  StyledMenuItem,
} from './styles';

import {
  ANALYTICS,
  BRIDGE,
  DOCS,
  FARMS,
  HOME,
  INSPIRIT,
  LENDANDBORROW,
  LIQUIDITY,
  NFTS,
  SWAP,
  GOVERNANCE,
  APEMODE,
  SPIRITWARS,
  BUYFTM,
  resolveRoutePath,
} from 'app/router/routes';
import { openInNewTab } from 'app/utils/redirectTab';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import useMobile from 'utils/isMobile';
import { setUnexpectedError } from 'store/errors';
import WalletConnect from 'app/assets/wallets/wallet-connect.png';
import { setGlobalSwapModeIndex, setIsHomePage } from 'store/general';
import {
  selectFtmInfo,
  selectMarketCap,
  selectSpiritInfo,
  selectTVL,
} from 'store/general/selectors';
import useWallets from 'app/hooks/useWallets';

const navMenus = [
  { ...HOME, icon: <HomeIcon /> },
  { ...SWAP, icon: <SwapIcon /> },
  { ...BRIDGE, icon: <BridgeIcon /> },
  { ...LIQUIDITY, icon: <MoneyHandIcon /> },
  { ...FARMS, icon: <FarmsIcon /> },
  { ...INSPIRIT, icon: <InSpiritIcon /> },
  {
    ...SPIRITWARS,
    icon: <MartialArtsSwordFencingIcon />,
  },
];

const navDropdownMenus = [
  LENDANDBORROW,
  ANALYTICS,
  NFTS,
  DOCS,
  GOVERNANCE,
  // APEMODE,
  BUYFTM,
];

const NavMenuItem = ({ menu, is_active }: NavMenuProps) => {
  const dispatch = useAppDispatch();
  const handleResetError = () => {
    dispatch(setUnexpectedError(false));
    dispatch(setGlobalSwapModeIndex(0));
  };

  return (
    <StyledMenuItem
      to={resolveRoutePath(menu.path)}
      $is_active={is_active}
      onClick={handleResetError}
    >
      <MenuButton is_active={is_active}>
        {is_active ? menu.icon : false}
        {menu.title}
      </MenuButton>
    </StyledMenuItem>
  );
};

const TopBar = () => {
  const translationPath = 'common.topBar';
  const menuTranslationPath = 'common.menu';
  const { account, isLoggedIn } = useWallets();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogout, _connector } = useLogin();
  const isMobile = useMobile();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [outsideClicked, setOutsideClicked] = useState<boolean>(false);
  const [menuIndex, setMenuIndex] = useState<number>(0);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(
    i18n.language,
  );
  const [isLessThan640px] = useMediaQuery('(max-width: 640px)');
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const TVL = useAppSelector(selectTVL);
  const marketCap = useAppSelector(selectMarketCap);
  const spiritPriceData = useAppSelector(selectSpiritInfo);
  const ftmPriceData = useAppSelector(selectFtmInfo);

  const spiritPrice: number = spiritPriceData ? spiritPriceData.price : 0;
  const ftmPrice: number = ftmPriceData ? ftmPriceData.price : 0;
  const percentaje24hsSpirit: number = spiritPriceData
    ? spiritPriceData.percentajeChange24
    : 0;
  const percentaje24hsFtm: number = ftmPriceData
    ? ftmPriceData.percentajeChange24
    : 0;
  const tokenInfos = () => {
    let info = [
      {
        name: 'MARKET CAP',
        priceCurrency: '$',
        price: !marketCap ? null : marketCap,
      },
      { name: 'TVL', priceCurrency: '$', price: TVL ?? 0 },
      {
        name: 'FTM',
        priceCurrency: '$',
        price: !ftmPrice ? null : ftmPrice,
        rate: !percentaje24hsFtm ? null : percentaje24hsFtm,
      },
      {
        name: 'SPIRIT',
        priceCurrency: '$',
        price: !spiritPrice ? null : spiritPrice,
        rate: !percentaje24hsFtm ? null : percentaje24hsSpirit,
      },
    ];

    if (isMobile) {
      const i = info.findIndex(item => item.name === 'FTM');
      info.splice(i, 1);
      info.unshift({
        name: 'SPIRIT',
        priceCurrency: '$',
        price: !spiritPrice ? null : spiritPrice,
        rate: !percentaje24hsSpirit ? null : percentaje24hsSpirit,
      });
    }

    return info;
  };

  const accountEllipsis = account
    ? isLessThan640px
      ? `${account.substring(0, 2)}..${account.substring(account.length - 4)}`
      : `${account.substring(0, 4)}...${account.substring(account.length - 4)}`
    : null;

  useEffect(() => {
    if (window.location.pathname === resolveRoutePath(HOME.path)) {
      dispatch(setIsHomePage(true));
    } else {
      dispatch(setIsHomePage(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  const [navMenuItems, setNavMenuItems] = useState<navMenusType[]>(navMenus);
  const translatedMenus = navMenuItems.map((menu: any) => ({
    title: t(`${menuTranslationPath}.${menu.key}`),
    path: menu.path,
    icon: menu.icon,
  }));
  const [navDropdownItems, setNavDropdownItems] =
    useState<navDropdownMenusType[]>(navDropdownMenus);

  const translatedDropdownMenus = navDropdownItems.map(menu => ({
    title: t(`${menuTranslationPath}.${menu.key}`),
    path: menu.path,
    url: menu.url,
  }));

  const onHideDropdown = () => {
    setShowDropdown(false);
    setOutsideClicked(true);
  };

  const onSelectLanguage = useCallback(
    id => {
      setSelectedLanguageId(id);
      i18n.changeLanguage(id);
    },
    [i18n],
  );

  const onMoreButtonClick = () => {
    !outsideClicked && setShowDropdown(!showDropdown);
  };

  const onSettingsButtonClick = () => {
    setShowSettingsModal(!showSettingsModal);
  };

  const navigateHome = () => {
    navigate(HOME.path);
  };

  const openConnectWalletModal = () => {
    onOpen();
  };

  const wallets = {
    injected: Metamask,
    walletconnect: WalletConnect,
  };

  useEffect(() => {
    setMenuIndex(
      [...navMenuItems, ...navDropdownItems].findIndex(menu =>
        location.pathname.includes(resolveRoutePath(menu.path)),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (outsideClicked) {
      setTimeout(() => {
        setOutsideClicked(false);
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outsideClicked]);

  const [isLargeMobile, isTablet, isLg, isLg2] = useMediaQuery([
    `(max-width: 880px)`,
    `(max-width: 950px)`,
    `(max-width: 1024px)`,
    `(max-width: 1200px)`,
  ]);

  useEffect(() => {
    if (isLargeMobile) {
      setTimeout(() => {
        setNavMenuItems(navMenus.slice(0, -4));
        setNavDropdownItems([
          ...Array.from(
            new Set([
              ...navDropdownMenus,
              INSPIRIT,
              FARMS,
              LIQUIDITY,
              SPIRITWARS,
            ]),
          ),
        ]);
      }, 100);
    } else if (isTablet) {
      setTimeout(() => {
        setNavMenuItems(navMenus.slice(0, -3));
        setNavDropdownItems([
          ...Array.from(
            new Set([...navDropdownMenus, INSPIRIT, FARMS, SPIRITWARS]),
          ),
        ]);
      }, 100);
    } else if (isLg) {
      setTimeout(() => {
        setNavMenuItems(navMenus.slice(0, -2));
        setNavDropdownItems([
          ...Array.from(new Set([...navDropdownMenus, INSPIRIT, SPIRITWARS])),
        ]);
      }, 100);
    } else if (isLg2) {
      setTimeout(() => {
        setNavMenuItems(navMenus.slice(0, -1));
        setNavDropdownItems([
          ...Array.from(new Set([...navDropdownMenus, SPIRITWARS])),
        ]);
      }, 100);
    } else {
      setTimeout(() => {
        setNavMenuItems(navMenus);
        setNavDropdownItems([...Array.from(new Set([...navDropdownMenus]))]);
      }, 100);
    }
  }, [isLg, isLg2, isTablet, isLargeMobile]);

  return (
    <Box
      id="top-bar"
      className="Header"
      pr={{ base: '0px', xl: '0', md: '4px' }}
    >
      <ContentWrapper>
        <TopWrapper>
          {tokenInfos().map((info, key) => (
            <StyledTokenInfoBar
              key={`${info.name}-${key}`}
              tokenName={info.name}
              tokenPriceCurrency={info.priceCurrency}
              tokenPrice={info.price}
              tokenRate={info?.rate}
            />
          ))}

          {!isMobile && (
            <Button
              variant="topBar"
              fontSize="14px"
              paddingInline="8px"
              onClick={() => openInNewTab('https://app.spiritswap.finance/#/')}
            >
              {t(`${translationPath}.switchV1`)}
            </Button>
          )}
        </TopWrapper>
        <BottomWrapper>
          <Box
            onClick={navigateHome}
            display="flex"
            alignItems="center"
            pr="spacing06"
            minW={{ base: '0', sm: '150px' }}
            minH="50px"
            marginLeft={isMobile ? '5px' : '0'}
            _hover={{ cursor: 'pointer' }}
          >
            {isMobile ? <SpiritMobileIcon /> : <SpiritDesktopIcon />}
          </Box>
          <MenuWrapper ref={ref}>
            {translatedMenus.map((menu, index) => {
              const active: boolean = Math.abs(menuIndex) === index || false;
              return (
                <NavMenuItem
                  key={`${menu.path}-${index}`}
                  menu={menu}
                  is_active={active}
                />
              );
            })}
            <MoreButtonWrapper>
              <MoreButton clicked={showDropdown} onClick={onMoreButtonClick}>
                {t(`${menuTranslationPath}.more`)}
                <CaretDownImage />
              </MoreButton>
              <NavDropdownWrapper>
                {showDropdown && (
                  <NavigationDropdown
                    items={translatedDropdownMenus}
                    onClickOutside={onHideDropdown}
                    width={ref?.current?.offsetWidth}
                  />
                )}
              </NavDropdownWrapper>
            </MoreButtonWrapper>
          </MenuWrapper>
          <HStack spacing="spacing03" justify="end" flex="1" mr="spacing04">
            {!isMobile && (
              <StyledMenuItem
                to={resolveRoutePath(SWAP.path)}
                $is_active={false}
              >
                <Button fontSize="base" fontWeight="normal">
                  <SoullyIcon />
                  <Skeleton
                    isLoaded={Boolean(spiritPrice)}
                    startColor="grayBorderBox"
                    endColor="bgBoxLighter"
                    w="49px"
                    h="24px"
                  >
                    <Text>${spiritPrice.toFixed(3)}</Text>
                  </Skeleton>
                </Button>
              </StyledMenuItem>
            )}

            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                backgroundColor="bgBox"
                border="none"
                fontSize="base"
              >
                <Image src={wallets[_connector]} w="20px" mr="8px" />
                <Text mr="8px">{accountEllipsis}</Text>
                <WalletExitIcon h="20px" w="20px" color="white" />
              </Button>
            ) : (
              <Button
                onClick={openConnectWalletModal}
                variant="inverted"
                fontSize="base"
              >
                <WalletIcon mr="spacing03" />
                {t(`${translationPath}.connect`)}
              </Button>
            )}

            <Button
              backgroundColor="bgBox"
              border="1px solid transparent"
              onClick={onSettingsButtonClick}
            >
              <SettingsIcon color="white" />
            </Button>
            {showSettingsModal && (
              <StyledSettingsModal
                selectedLanguageId={''}
                onClose={() => {
                  setTimeout(() => {
                    setShowSettingsModal(false);
                  }, 30);
                }}
                onSelectLanguage={onSelectLanguage}
              />
            )}
          </HStack>
        </BottomWrapper>
      </ContentWrapper>
      <ConnectWallet isOpen={isOpen} dismiss={onClose} />
    </Box>
  );
};

export default TopBar;
