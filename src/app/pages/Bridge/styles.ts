import styled from '@emotion/styled';
import { ReactComponent as Down } from 'app/assets/images/caret-down.svg';
import { Flex } from '@chakra-ui/react';

export const Container = styled.div`
  transition: margin-top 0.2s ease 0s,
    margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  transform: translate3d(0px, 0px, 0px);
  max-width: 100%;
  padding: 0 0 100px 0;
`;

export const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px 0px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0px 16px 0px;
    padding-bottom: 120px;
  }
`;

export const BridgeTokenContainer = styled.div`
  padding: 24px;
  width: 100%;
  height: auto;
  background: ${({ theme }) => theme.colors.bgBox};
  border: 1px solid ${({ theme }) => theme.colors.grayBorderBox};
  box-sizing: border-box;
  backdrop-filter: blur(12px);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: 7px 0px 5px 0px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0px 0px 5px 0px;
  }
`;

export const TradingForm = styled(Flex)<{ top: string }>`
  width: 100%;
  & > ul {
    width: 207px;
    top: ${({ top }) => top};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    text-align: center;
    & > ul {
      width: 330px;
      top: ${({ top }) => top};
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    text-align: center;
    & > ul {
      width: 95%;
      top: calc(${({ top }) => top} - 16px);
    }
  }
`;

export const TradingDownIcon = styled(Down)`
  margin: 0px 4px;
  color: ${({ theme }) => theme.colors.ci};
`;
