import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import type { MenuButtonProps } from './Footer.d';

import {
  HomeSvg,
  SwapSvg,
  LiquiditySvg,
  BridgeSvg,
  DotsSvg,
  InSpiritSvg,
} from './index';

export const Wrapper = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }

  display: flex;
  flex-direction: column;
  // changed position: absolute to position: fixed
  position: absolute;
  bottom: 0;
  width: 100%;
`;

export const HourGlassImg = styled.img`
  height: 24px;
`;

export const ThirdPartyItemsDiv = styled.div`
  a {
    padding: 14px;
    display: inline-block;

    @media (max-width: 320px) {
      padding: 6px;
    }

    svg {
      display: block;
      color: #fff;
    }

    &:hover svg {
      color: ${({ theme }) => theme.color.ci};
    }
  }
`;

export const AuditedByDiv = styled.div`
  display: flex;
  align-items: flex-end;
  margin-left: 15px;
  align-items: start;
`;

export const FooterDiv = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }

  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MenuWrapper = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }

  display: inline-grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 4px;
  position: fixed;
  bottom: -3px;
  width: 100%;
  padding: 4px;
  z-index: 1000;
  background: ${({ theme }) => theme.color.bgBox};
  border-radius: ${({ theme }) =>
    `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`};
`;

export const DomainWrapper = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 4px;
  padding: 12px 0;
  background: ${({ theme }) => theme.color.bgBox};
`;

export const StyledMenuItem = styled(NavLink)<{ $is_active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0;
  gap: 2px;
  text-decoration: none;
  background: ${({ theme, $is_active }) =>
    $is_active ? theme.color.ciTrans15 : 'transparent'};
  color: ${({ theme, $is_active }) =>
    $is_active ? theme.color.ci : theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

export const HomeIcon = styled(HomeSvg)<MenuButtonProps>`
  color: ${({ selected, theme }) =>
    selected ? theme.color.ci : theme.color.white};
`;
export const SwapIcon = styled(SwapSvg)<MenuButtonProps>`
  color: ${({ selected, theme }) =>
    selected ? theme.color.ci : theme.color.white};
`;
export const LiquidityIcon = styled(LiquiditySvg)<MenuButtonProps>`
  color: ${({ selected, theme }) =>
    selected ? theme.color.ci : theme.color.white};
`;
export const BridgeIcon = styled(BridgeSvg)<MenuButtonProps>`
  color: ${({ selected, theme }) =>
    selected ? theme.color.ci : theme.color.white};
`;
export const DotsIcon = styled(DotsSvg)<MenuButtonProps>`
  color: ${({ selected, theme }) =>
    selected ? theme.color.ci : theme.color.white};
`;
export const InSpiritIcon = styled(InSpiritSvg)<MenuButtonProps>`
  color: ${({ selected, theme }) =>
    selected ? theme.color.ci : theme.color.white};
`;
export const MenuLabel = styled.span`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.color.white};
  font-family: ${({ theme }) => theme.fontFamily.sans};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  line-height: ${({ theme }) => theme.lineHeight.h4};
`;

export const MoreButtonWrapper = styled.div<MenuButtonProps>`
  background: ${({ selected, theme }) =>
    selected ? theme.color.ciTrans15 : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0;
  gap: 2px;
  position: relative;
`;

export const MoreButtonLabel = styled.span`
  color: ${({ theme }) => theme.color.white};
  font-family: ${({ theme }) => theme.fontFamily.sans};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  line-height: ${({ theme }) => theme.lineHeight.h4};
`;

export const NavDropdownWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 62px;
`;
