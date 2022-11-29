import styled from '@emotion/styled';
import { Icon } from 'app/components/Icon';
import { Select } from 'app/components/Select';
import { Heading } from 'app/components/Typography';
import { Panel } from 'app/components/Panel';
import { IconButton } from 'app/components/IconButton';
import { TokensPanel } from 'app/pages/Portfolio/components/TokensPanel';
import { LiquidityPanel } from 'app/pages/Portfolio/components/LiquidityPanel';
import { AboutSectionImageWrapperProps } from './AboutSectionItem';
import { ArrowDownCircleIcon } from 'app/assets/icons';

export const AboutSectionContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const AboutSectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const AboutSectionTitleIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.ci};
`;

export const AboutSectionTitleSpan = styled.span`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.h2};
    line-height: ${({ theme }) => theme.lineHeights.h2};
  }
  font-family: ${({ theme }) => theme.fontFamily.sans};
  font-size: 40px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  line-height: 64px;
  color: ${({ theme }) => theme.colors.white};
`;

export const AboutSectionButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid ${({ theme }) => theme.colors.grayBorderBox};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-sizing: border-box;
  gap: 8px;
  padding: 16px;
  margin-top: 48px;
`;

export const AboutSectionImageWrapper = styled.img<AboutSectionImageWrapperProps>`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 32px;
  }
  width: 100%;
  margin-inline: auto;
  max-width: 428px;
`;

/* styles for PartnersWrapper */
export const PartnersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 132px;
  margin-bottom: 128px;
`;

export const PartnerItemsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 150px;
  grid-column-gap: 0px;
  padding: 12px 32px;
  margin-top: 48px;
  justify-content: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 12px 0px;
    margin-top: 16px;
    height: 320px;
  }
`;

export const PartnerItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  gap: 8px;
  margin-bottom: 20px;
  width: 105px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: 0 24%;
  }
`;

export const PartnerItemIcon = styled.img`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 32px;
    height: 32px;
  }
  width: 48px;
  height: 48px;
`;

/* styles for WalletPanel */
export const WalletPanelWrapper = styled(Panel)`
  width: 100%;
  padding: 12px;
`;

export const WalletPanelTitle = styled(Heading)`
  color: ${({ theme }) => theme.colors.grayDarker};
`;

export const WalletPanelBottomWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

/* styles for Portfolio */
export const PortfolioWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 86px;
    margin-bottom: 120px;
    padding: 0 8px;
  }
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 128px;
  margin-bottom: 64px;
  padding: 0 130px;
`;

export const PortfolioTopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  padding-top: 26px;
  gap: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 13px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-top: 3px;
  }
`;

export const PortfolioHeaderWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    justify-content: center;
    gap: 12px;
  }
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const PortfolioHeader1Wrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: space-between;
  }
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PortfolioSelectorWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    justify-content: space-around;
    gap: 0;
  }
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 4px;
`;

export const PortfolioPriceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const PortfolioChartStyleSelect = styled(Select)`
  width: 68px;
  height: 36px;
  div {
    height: 28px;
    width: 28px;
    padding: 5.25px;
  }
`;

export const PortfolioLandingButton = styled(IconButton)`
  font-size: ${({ theme }) => theme.fontSize.h4};
  line-height: ${({ theme }) => theme.lineHeight.h4};
  width: 100%;
`;

export const PortfolioPanelsWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  display: inline-grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 12px;
  align-items: flex-start;
  margin-top: 40px;
`;

export const PortfolioTokensPanel = styled(TokensPanel)`
  width: 100%;
`;

export const PortfolioLiquidityPanel = styled(LiquidityPanel)`
  width: 100%;
`;

/* styles for SocialSection */
export const SocialSectionWrapper = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  margin-top: 16px;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

export const StyledArrowDownCircleIcon = styled(ArrowDownCircleIcon)`
  margin-right: 8px;
`;

export const SocialAuditedByWrapper = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

export const SocialMixBytesImg = styled.img`
  margin-left: 8px;
  height: 20px;
`;

export const SocialThirdPartyItemsWrapper = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 16px;
  }
  svg:hover {
    color: ${({ theme }) => theme.colors.ci};
  }
`;
