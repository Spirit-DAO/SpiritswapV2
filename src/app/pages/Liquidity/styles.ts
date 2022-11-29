import styled from 'styled-components';
import { ReactComponent as Setting } from 'app/assets/images/title-setting.svg';
import { Icon } from 'app/components/Icon';

interface Props {
  padding?: number;
  opacity?: number;
  Selected?: boolean;
}
export const StyledLiquidityWrapper = styled.div`
  display: flex;
  justify-content: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    align-items: center;
    flex-direction: column;
    padding-bottom: 110px;
    margin-top: 1px;
    padding-top: 26px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-top: 73px;
  }
`;

export const StyledAddLiquidity = styled.div`
  background: ${({ theme }) => theme.color.bgBox};
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.color.grayBorderBox};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 504px;
  height: fit-content;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: 27px auto;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 11px;
    width: 95%;
    margin: 0px auto;
  }
`;

export const StyledSection = styled.div`
  display: flex;
  padding-top: 105px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 98px;
  }
`;

export const StyledContainer = styled.div`
  -webkit-box-flex: 1;
  flex-grow: 1;
  transition: margin-top 0.2s ease 0s,
    margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  transform: translate3d(0px, 0px, 0px);
  max-width: 100%;
`;

export const StyledLiquiditySetting = styled(Setting)`
  width: 24px;
  color: ${({ theme }) => theme.color.ci};
  cursor: pointer;
`;

export const YourLiquidityWrapper = styled.div`
  max-width: 504px;
  margin: 0px 12px;
  width: 504px;
  z-index: 1;

  @media (max-width: 1024px) {
    width: 100%;
    margin: auto;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 24px auto;
    min-width: 95%;
    width: 95%;
  }
`;

export const CollapseSection = styled.div<Props>`
  padding: 24px;
  background: ${({ theme }) => theme.color.bgBox};
  border: 1px solid ${({ theme }) => theme.color.grayBorderBox};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  @media (max-width: 1024px) {
    margin: 0px auto;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${props => {
      return `${props.padding}px`;
    }};
  }
`;

export const StyledFarmIcon = styled(Icon)`
  color: ${({ theme }) => theme.color.ci};
  background: ${({ theme }) => theme.color.ciTrans15};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 6px;
`;
