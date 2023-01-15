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
  APEMODE,
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
  // APEMODE,
  FARMS,
  SPIRITWARS,
  BUYFTM,
];

const NavMenuItem = ({ menu, is_active }: NavMenuProps) => {
  const Image = menu.image;
  const dispatch = useAppDispatch();
  const handleResetError = () => dispatch(setUnexpectedError(false));

  return (
    <StyledMenuItem
      to={resolveRoutePath(menu.path)}
      $is_active={is_active}
      onClick={handleResetError}
    >
      <Icon size="24px" icon={<Image selected={is_active} />} />
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
    path: resolveRoutePath(menu.path),
  }));
  const translatedDropdownMenus = navDropdownMenus.map((menu: any) => ({
    title: t(`${menuTranslationPath}.${menu.key}`),
    path: resolveRoutePath(menu.path),
    url: menu.url,
  }));

  const [showDropdown, setShowDropdown] = useState(false);
  const [outsideClicked, setOutsideClicked] = useState(false);
  const location = useLocation();
  const [menuIndex, setMenuIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const onHideDropdownCallback = useCallback(() => {
    setShowDropdown(false);
    setOutsideClicked(true);
  }, [setShowDropdown, setOutsideClicked]);

  const onClickMoreButton = () => {
    !outsideClicked && setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    setMenuIndex(
      [...translatedNavMenus, ...translatedDropdownMenus].findIndex(
        menu => location.pathname === resolveRoutePath(menu.path),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

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
          <a
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/Spirit_Swap"
          >
            <TwitterSvg />
          </a>
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
        {translatedNavMenus.map((menu, index) => {
          const active: boolean = Math.abs(menuIndex) === index || false;
          return (
            <NavMenuItem
              key={`${menu.path}-${active}`}
              menu={menu}
              is_active={active}
            />
          );
        })}
        <MoreButtonWrapper selected={showDropdown} onClick={onClickMoreButton}>
          <Icon size="24px" icon={<DotsIcon selected={showDropdown} />} />
          <MoreButtonLabel>More</MoreButtonLabel>
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
