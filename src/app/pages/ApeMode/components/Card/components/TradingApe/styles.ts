import styled from 'styled-components';
import { Heading } from 'app/components/Typography';
import { Input } from 'app/components/Input';
import { ReactComponent as FantomLogo } from 'app/assets/images/fantom-logo.svg';
import { ReactComponent as SpiritLogo } from 'app/assets/images/ghost-circle.svg';
import { ReactComponent as FantomIcon } from 'app/assets/images/caret-down.svg';
import { StepSlider } from 'app/components/StepSlider';
import { ReactComponent as Swap } from 'app/assets/images/swap.svg';
import { ReactComponent as RefrehIcon } from 'app/assets/images/refresh.svg';

export const TradingItem = styled.div`
  background: ${({ theme }) => theme.color.bgBoxLighter};
  // border: 1px solid ${({ theme }) => theme.color.grayBorderBox};
  box-sizing: border-box;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 12px;
  margin-bottom: 10px;
`;

export const TradingTitle = styled(Heading)`
  padding: 8px 0px;
  position: static;
  margin: 0px 10px;
  display: flex;
  flex-direction: column;
`;

export const BalancePrice = styled.div`
  float: right;
  color: ${({ theme }) => theme.color.gray};
  span {
    color: ${({ theme }) => theme.color.ci};
  }
`;

export const TradingDetail = styled.div`
  display: flex;
  align-items: center;
  padding: 0px;
`;

export const TradingLogo = styled(FantomLogo)`
  margin: 0px 8px;
`;

export const SpiritFormLogo = styled(SpiritLogo)`
  margin: 0px 8px;
`;

export const TradingItemLogo = styled.div`
  width: 32px;
  height: 32px;
  margin: 0px 8px;
  background-image: ${props => `url(${props?.color})`};
`;

export const TradingLogoDetail = styled.div`
  display: flex;
  align-items: center;
`;

export const TradingLogoDetailTitle = styled(Heading)`
  margin: 0px 4px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1rem;
  }
`;

export const TradingLogoDetailTitleIcon = styled(FantomIcon)`
  margin: 0px 4px;
  color: ${({ theme }) => theme.color.grayDarker};
`;

export const TradingPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px 0px 4px;
  flex-grow: 1;
  margin: 0px 10px 0px 0px;
  div {
    border-width: 0px;
  }
`;

export const TradingActualPrice = styled(Input)`
  position: static;
  background-color: ${({ theme }) => theme.color.bgBoxLighter};
  font-weight: ${({ theme }) => theme.fontWeight.large};
  font-size: ${({ theme }) => theme.fontSize.h1} !important;
  line-height: ${({ theme }) => theme.lineHeight.h1};
  color: ${({ theme }) => theme.color.white};
  padding: 0 !important;
  text-align: end;
  width: 55px;
  input {
    font-size: 16px;
    text-align: start;
    padding: 0;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 155px;
    input {
      font-size: 1rem;
    }
  }
`;

export const TradingApproxPrice = styled.div`
  position: static;
  font-size: ${({ theme }) => theme.fontSize.sub};
  line-height: ${({ theme }) => theme.lineHeight.p};
  color: ${({ theme }) => theme.color.grayDarker};
`;

export const SwapToken = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 8px;
  position: static;
  flex: none;
  order: 2;
  flex-grow: 0;
  margin: 0px;
  color: ${({ theme }) => theme.color.ci};
`;

export const SwapIcon = styled(Swap)`
  color: ${({ theme }) => theme.color.ci};
  transform: rotate(90deg);
`;

export const LimitContainer = styled.div`
  padding: 0px 12px;
  margin: 4px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LimitHeader = styled.div``;

export const LimitValueTag = styled.div`
  span {
    color: ${({ theme }) => theme.color.danger};
    font-size: ${({ theme }) => theme.fontSize.sub};
    line-height: ${({ theme }) => theme.lineHeight.sub};
  }
`;

export const LimitValueName = styled(Heading)`
  color: ${({ theme }) => theme.color.gray};
`;

export const LimitValue = styled(Heading)``;
export const Refresh = styled(RefrehIcon)`
  color: ${({ theme }) => theme.color.ci};
`;

export const TotalTradingTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: 16px 0px 0px 0px;
  color: ${({ theme }) => theme.color.white};
`;

export const TotalTradingPrice = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  margin: 0px 8px;
`;

export const TotalTradingApproxPrice = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sub};
  line-height: ${({ theme }) => theme.lineHeight.p};
  text-align: center;
  color: ${({ theme }) => theme.color.grayDarker};
  margin: 0px;
`;

export const CurrencySelection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
`;
export const StepSliderStyled = styled(StepSlider)`
  top: -5px;
`;
