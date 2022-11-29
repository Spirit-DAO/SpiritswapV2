import styled from 'styled-components';
import { Heading } from 'app/components/Typography';
import { ReactComponent as SpiritLogo } from 'app/assets/images/ghost-circle.svg';
import { ReactComponent as Swap } from 'app/assets/images/swap.svg';
import { ReactComponent as ArrowDownIcon } from 'app/assets/images/arrow-down.svg';

export const StyledTradingItem = styled.div`
  background: ${({ theme }) => theme.color.bgInput};
  border: 1px solid ${({ theme }) => theme.color.grayBorderBox};
  box-sizing: border-box;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const StyledSpiritFormLogo = styled(SpiritLogo)`
  margin: 0px 8px;
`;

export const StyledSwapToken = styled.div`
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

export const StyledSwapIcon = styled(Swap)`
  color: ${({ theme }) => theme.color.ci};
  transform: rotate(90deg);
`;

export const StyledArrowDownIcon = styled(ArrowDownIcon)`
  color: ${({ theme }) => theme.color.ci};
`;

export const StyledLimitValue = styled(Heading)``;

export const StyledTotalTradingTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: 16px 0px 0px 0px;
  color: ${({ theme }) => theme.color.white};
  font-family: ${({ theme }) => theme.fontFamily.sans};
`;

export const StyledTotalTradingPrice = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  margin: 0px 8px;
`;

export const StyledTotalTradingApproxPrice = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sub};
  line-height: ${({ theme }) => theme.lineHeight.p};
  text-align: center;
  color: ${({ theme }) => theme.color.grayDarker};
  margin: 0px;
`;
