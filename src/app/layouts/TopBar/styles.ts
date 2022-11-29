import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Heading } from 'app/components/Typography';
import { SettingsModal } from 'app/components/SettingsModal';
import { ReactComponent as CaretDown } from 'app/assets/images/caret-down.svg';
import { ReactComponent as GhostImage } from 'app/assets/images/ghost.svg';
import { ReactComponent as MoneyHand } from 'app/assets/images/money-with-hand-small.svg';
import { ReactComponent as Bridge } from 'app/assets/images/bridge.svg';
import { ReactComponent as Swap } from 'app/assets/images/menu-swap.svg';
import { ReactComponent as Farms } from 'app/assets/images/menu-farms.svg';
import { ReactComponent as InSpirit } from 'app/assets/images/menu-inspirit.svg';
import { ReactComponent as Home } from 'app/assets/images/menu-home.svg';
import { TokenInfoBar } from './components/TokenInfoBar';
import type { MoreButtonProps, MenuButtonProps } from './TopBar.d';

export const ContentWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 5px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding-top: 5px;
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  padding-top: 5px;
  width: 1280px;
  user-select: none;
`;
export const TopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  gap: 8px;
  margin-right: 4px;
`;

const baseIconStyle = css`
  height: 24px;
  width: 24px;
  margin: 1px 0 0 4px;
`;

export const MoneyHandIcon = styled(MoneyHand)`
  ${baseIconStyle}
`;

export const BridgeIcon = styled(Bridge)`
  ${baseIconStyle}
`;

export const SwapIcon = styled(Swap)`
  ${baseIconStyle}
`;

export const FarmsIcon = styled(Farms)`
  ${baseIconStyle}
`;

export const HomeIcon = styled(Home)`
  ${baseIconStyle}
`;

export const InSpiritIcon = styled(InSpirit)`
  ${baseIconStyle}
`;

export const StyledTokenInfoBar = styled(TokenInfoBar)`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    &:nth-of-type(n + 3) {
      display: none;
    }
  }
`;
export const BottomWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 11px;
`;

export const StyledGhostImage = styled(GhostImage)`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 36px;
    height: 60px;
  }
  width: 57px;
  height: 64px;
  margin-right: 4px;
`;
export const StyledHeading = styled(Heading)`
  color: ${({ theme }) => theme.color.ci};
`;
export const MenuWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const MenuButton = styled.button<MenuButtonProps>`
  background: transparent;
  display: flex;
  border: none;
  gap: ${({ theme }) => theme.spacing.spacing02};
  color: ${({ is_active, theme }) =>
    is_active ? theme.color.ci : theme.color.white};
  font-family: ${({ theme }) => theme.fontFamily.sans};
  font-size: ${({ theme }) => theme.fontSize.h3};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  line-height: ${({ theme }) => theme.lineHeight.h3};
  padding: 4px 8px;
  cursor: pointer;
`;
export const MoreButtonWrapper = styled.div`
  position: relative;
`;
export const MoreButton = styled.button<MoreButtonProps>`
  background: ${({ clicked, theme }) =>
    clicked ? theme.color.ciTrans15 : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: none;
  color: ${({ clicked, theme }) =>
    clicked ? theme.color.ci : theme.color.white};
  font-family: ${({ theme }) => theme.fontFamily.sans};
  font-size: ${({ theme }) => theme.fontSize.h3};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  line-height: ${({ theme }) => theme.lineHeight.h3};
  padding: 4px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;
export const CaretDownImage = styled(CaretDown)`
  width: 16px;
  height: 16px;
  margin-left: 2px;
`;
export const NavDropdownWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 40px;

  & > div {
    box-shadow: 0 2px 8px rgb(0 0 0 / 25%);
  }
`;
export const StyledMenuItem = styled(NavLink)<{ $is_active: boolean }>`
  margin-right: 8px;
  background: ${({ theme, $is_active }) =>
    $is_active ? theme.color.ciTrans15 : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

export const StyledSettingsModal = styled(SettingsModal)`
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    right: calc((100vw - 1280px) / 2);
  }
  position: fixed;
  right: 8px;
  top: 100px;
  z-index: 1;
`;
