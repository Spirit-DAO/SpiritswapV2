import styled from '@emotion/styled';
import { Heading } from 'app/components/Typography';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 8px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: 0;
  }
`;

export const ContentWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  padding: 0;
  width: 1280px;
`;

export const WalletWrapper = styled.div<{ isMobile: boolean }>`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: auto;
  }
  display: flex;
  padding: 0 16px 0 16px;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
`;

export const WalletTitle = styled(Heading)`
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 56px;
    line-height: 64px;
    margin-top: 0;
  }

  margin-top: 36px;
  white-space: nowrap;
`;

export const StyledWalletDescription = styled(Heading)`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
    line-height: 20px;
    padding-right: 32px;
  }
  margin-top: 24px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const WalletButtonWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: inline-grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    margin-top: 32px;
  }

  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 64px;
`;

export const WalletPanelWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 8px;
  }
  display: flex;
  flex-direction: row;
  gap: 4px;
  margin-top: 24px;
`;

export const PortfolioWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
