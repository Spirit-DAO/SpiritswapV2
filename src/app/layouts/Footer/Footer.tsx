import { useEffect, useCallback, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { NavigationDropdown } from 'app/components/NavigationDropdown';
import {
  HourGlassPng,
  DiscordSvg,
  TwitterSvg,
  GitHubSvg,
  MediumSvg,
  YouTubeSvg,
} from './index';

import { Icon } from 'app/components/Icon';
import type { NavMenuProps } from './Footer.d';
import {
  Wrapper,
  FooterDiv,
  AuditedByDiv,
  HourGlassImg,
  ThirdPartyItemsDiv,
  MenuWrapper,
  StyledMenuItem,
  HomeIcon,
  SwapIcon,
  LiquidityIcon,
  DotsIcon,
  MenuLabel,
  MoreButtonWrapper,
  MoreButtonLabel,
  NavDropdownWrapper,
  InSpiritIcon,
} from './styles';

import {
  ANALYTICS,
  BRIDGE,
  BUYFTM,
  DOCS,
  FARMS,
  GOVERNANCE,
  HOME,
  INSPIRIT,
  LENDANDBORROW,
  LIQUIDITY,
  NFTS,
  SWAP,
  SPIRITWARS,
  resolveRoutePath,
} from 'app/router/routes';
import { useAppDispatch } from 'store/hooks';
import { setUnexpectedError } from 'store/errors';

const navMenus = [
  { ...HOME, image: HomeIcon },
  { ...SWAP, image: SwapIcon },
  { ...LIQUIDITY, image: LiquidityIcon },
  { ...INSPIRIT, image: InSpiritIcon },
];

const navDropdownMenus = [
  GOVERNANCE,
  DOCS,
  NFTS,
  ANALYTICS,
  LENDANDBORROW,
  BRIDGE,
  FARMS,
  SPIRITWARS,
  BUYFTM,
];

const NavMenuItem = ({ menu }: NavMenuProps) => {
  const Image = menu.image;
  const dispatch = useAppDispatch();
  const handleResetError = () => dispatch(setUnexpectedError(false));
  const { pathname } = useLocation();

  const isActive = pathname?.replace('/', '') === menu?.path?.toLowerCase();

  return (
    <StyledMenuItem
      to={resolveRoutePath(menu.path)}
      $is_active={isActive}
      onClick={handleResetError}
    >
      <Icon size="24px" icon={<Image selected={isActive} />} />
      <MenuLabel>{menu.title}</MenuLabel>
    </StyledMenuItem>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  const translationPath = 'common.footer';
  const menuTranslationPath = 'common.menu';
  const translatedNavMenus = navMenus.map(menu => ({
    title: t(`${menuTranslationPath}.${menu.key}`),
    image: menu.image,
    path: menu.path,
  }));
  const translatedDropdownMenus = navDropdownMenus.map((menu: any) => ({
    title: t(`${menuTranslationPath}.${menu.key}`),
    path: menu.path,
    url: menu.url,
  }));

  const [showDropdown, setShowDropdown] = useState(false);
  const [outsideClicked, setOutsideClicked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const onHideDropdownCallback = useCallback(() => {
    setShowDropdown(false);
    setOutsideClicked(true);
  }, [setShowDropdown, setOutsideClicked]);

  const onClickMoreButton = () => {
    !outsideClicked && setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    outsideClicked &&
      setTimeout(() => {
        setOutsideClicked(false);
      }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outsideClicked]);

  return (
    <Wrapper>
      <FooterDiv>
        <AuditedByDiv>
          <span>{t(`${translationPath}.auditedBy`)}</span>
          <HourGlassImg src={HourGlassPng} alt="hour-glass Img" />
        </AuditedByDiv>
        <ThirdPartyItemsDiv>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://discord.gg/8FGd4nFQdT"
          >
            <DiscordSvg />
          </a>
          {/* <a
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/Spirit_Swap"
          >
            <TwitterSvg />
          </a> */}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/Spirit-DAO/"
          >
            <GitHubSvg />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://spiritswap.medium.com/"
          >
            <MediumSvg />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.youtube.com/channel/UCrKLtNctO0obN4-bDMGlFuQ"
          >
            <YouTubeSvg />
          </a>
        </ThirdPartyItemsDiv>
      </FooterDiv>
      <MenuWrapper ref={ref}>
        {translatedNavMenus.map(menu => {
          return <NavMenuItem key={menu.path} menu={menu} />;
        })}
        <MoreButtonWrapper selected={showDropdown} onClick={onClickMoreButton}>
          <Icon size="24px" icon={<DotsIcon selected={showDropdown} />} />
          <MoreButtonLabel>Moreee</MoreButtonLabel>
          <NavDropdownWrapper>
            {showDropdown && (
              <NavigationDropdown
                items={translatedDropdownMenus}
                onClickOutside={onHideDropdownCallback}
                width={ref.current ? ref.current.offsetWidth : 0}
              />
            )}
          </NavDropdownWrapper>
        </MoreButtonWrapper>
      </MenuWrapper>
    </Wrapper>
  );
};

export default Footer;
