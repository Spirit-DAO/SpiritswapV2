import styled, { css } from 'styled-components';
import type { TokenAmountPanelProps } from './TokenAmountPanel.d';
import { Input } from '../Input';
import { NumberInput } from '../NumberInput';
import { Dropdown } from '../Dropdown';

export const TokenAmountPanelWrapper = styled.div<TokenAmountPanelProps>`
  color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) =>
    `${theme.spacing.spacing05} ${theme.spacing.spacing055}`};
  background-color: ${({ theme }) => theme.color.bgBoxLighter};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: ${({ theme }) =>
      `${theme.spacing.spacing05} ${theme.spacing.spacing03}`};
  }
`;

export const InputAndTokenWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const InputWrapper = styled.div<{ isFocused: boolean }>`
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid transparent;
  flex-grow: 1;
  padding: ${({ theme }) => `${theme.spacing.spacing02} 0`};
  margin-right: ${({ theme }) => theme.spacing.spacing03};

  ${({ isFocused }) =>
    isFocused &&
    css`
      background-color: ${({ theme }) => theme.color.bgInput};
      border-color: ${({ theme }) => theme.color.grayBorderBox};
    `}

  button {
    margin-right: 6px;
    padding: ${({ theme }) =>
      `${theme.spacing.spacing01} ${theme.spacing.spacing03}`};
    font-size: ${({ theme }) => theme.fontSize.xs};
    line-height: ${({ theme }) => theme.lineHeight.xs};
    border-radius: ${({ theme }) => theme.borderRadius.xs};
  }

  &:hover {
    background-color: ${({ theme }) => theme.color.bgInput};
  }
`;

export const StyledInput = styled(NumberInput)`
  font-size: ${({ theme }) => theme.fontSize.xl2};
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.white};
  display: block;
  width: 100%;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  padding: ${({ theme }) => `0 ${theme.spacing.spacing03}`};
  line-height: 1;
  height: ${({ theme }) => theme.spacing.spacing06};

  &:focus {
    outline: none;
  }

  & > input {
    padding-left: 0;
    padding-right: 0;
    line-height: 1;
    font-size: ${({ theme }) => theme.fontSize.xl2};
    height: ${({ theme }) => theme.spacing.spacing06};
  }
`;

export const CurrencyEstimateAndBalanceWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.color.gray};
  font-size: ${({ theme }) => theme.fontSize.xs};
  padding: ${({ theme }) =>
    `${theme.spacing.spacing02} 0 ${theme.spacing.spacing01} ${theme.spacing.spacing03}`};
  line-height: ${({ theme }) => theme.lineHeight.sm};
`;

export const CurrencyEstimateWrapper = styled.span``;
export const BalanceWrapper = styled.span``;

export const LimitOrderPanelFooterWrapper = styled.div`
  padding: ${({ theme }) =>
    `${theme.spacing.spacing03} ${theme.spacing.spacing055}`};
  margin: ${({ theme }) =>
    `${theme.spacing.spacing03} -${theme.spacing.spacing055} -${theme.spacing.spacing05} -${theme.spacing.spacing055}`};
  background-color: ${({ theme }) => theme.color.bgBoxDarker};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: ${({ theme }) => theme.spacing.spacing03};
    margin: ${({ theme }) =>
      `${theme.spacing.spacing03} -${theme.spacing.spacing03} -${theme.spacing.spacing05} -${theme.spacing.spacing03}`};
  }
`;

export const LimitOrderLabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${({ theme }) => theme.spacing.spacing05};
  min-width: 128px;
`;
export const LimitOrderLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
  line-height: ${({ theme }) => theme.lineHeight.baseLg};
`;
export const LimitOrderWarning = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: ${({ theme }) => theme.lineHeight.sm};
  color: ${({ theme }) => theme.color.danger};
`;

export const LimitOrderInputWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const StyledLimitOrderInput = styled(Input)`
  border: none;

  input {
    text-align: right;
  }
`;

export const TokenWrapper = styled.div`
  position: relative;
`;

export const TokenDropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.xl2};
  line-height: 1;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    background-color: ${({ theme }) => theme.color.bgInput};
  }

  svg:first-of-type {
    border-radius: 50%;
    margin-right: ${({ theme }) => theme.spacing.spacing02};
  }

  svg:last-child {
    color: ${({ theme }) => theme.color.ci};
  }
`;

export const StyledTokenDropdown = styled(Dropdown)`
  right: 0;
`;

export const PercentageWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  & > button {
    width: 100%;
    margin: 0 2px;
  }
`;

export const TokenDropdownItem = styled.span`
  display: flex;
  align-items: center;

  svg {
    margin-right: ${({ theme }) => theme.spacing.spacing03};
  }
`;
