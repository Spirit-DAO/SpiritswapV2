import styled from '@emotion/styled';
import { StyledRateProps } from './TokenInfoBar.d';

export const StyledContainer = styled.div<{ isSpirit: boolean }>`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 50%;
  }
  background-color: ${({ theme, isSpirit }) =>
    isSpirit ? theme.colors.ciTrans15 : theme.colors.bgBox};
  padding: 4px 8px 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const StyledNameLabel = styled.div<{ isSpirit: boolean }>`
  color: ${({ theme, isSpirit }) =>
    isSpirit ? theme.colors.ci : theme.colors.grayDarker};
  font-size: 14px;
  margin-right: 8px;
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  line-height: ${({ theme }) => theme.lineHeights.p};
`;

export const StyledPriceLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  line-height: ${({ theme }) => theme.lineHeights.p};
`;

export const StyledRateLabel = styled.div<StyledRateProps>`
  color: ${({ theme, isPlus }) => {
    return isPlus ? theme.colors.ci : theme.colors.danger;
  }};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  line-height: ${({ theme }) => theme.lineHeights.p};
  margin-left: 8px;
`;
