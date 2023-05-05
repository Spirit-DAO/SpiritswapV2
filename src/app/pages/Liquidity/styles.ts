import styled, { keyframes } from 'styled-components';
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

const concentratedAnimation = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

export const StyledConcentratedLiqudityLabel = styled.h4`
  padding: 0.25rem 0.75rem;
  background: ${({ theme }) => theme.color.bgBox};
  position: relative;
  border-radius: 3px;
  margin-left: 4px;

  &:hover {
    background: ${({ theme }) => theme.color.grayBorderBox};
  }

  &:after {
    content: '';
    position: absolute;
    top: calc(-1 * 3px);
    left: calc(-1 * 3px);
    height: calc(100% + 3px * 2);
    width: calc(100% + 3px * 2);
    background: linear-gradient(60deg, #60e6c5, #a86dee, #6088e6);
    border-radius: calc(2 * 3px);
    z-index: -1;
    animation: ${concentratedAnimation} 3s ease alternate infinite;
    background-size: 300% 300%;
  }
`;
