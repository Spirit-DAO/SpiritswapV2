import { Box, Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const StyledPanel = styled.div`
  padding: ${({ theme }) => `${theme.space.spacing06}`};
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  border: ${({ theme }) => `1px solid ${theme.colors.grayBorderBox}`};
  background-color: ${({ theme }) => `${theme.colors.bgBox}`};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => `${theme.space.spacing03}`};
    padding-top: 12px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-bottom: 8px;
  }
`;

export const StyledFlexItem = styled.div`
  font-size: ${({ theme }) => `${theme.fontSizes.sm}`};
  color: ${({ theme }) => `${theme.colors.grayDarker}`};
  flex: 1;
`;

export const StyledPanelBox = styled.div`
  background: ${({ theme }) => theme.colors.bgBoxLighter};
  padding: 8px;
  border-radius: 4px;
  flex-grow: 1;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    all: unset;
    width: 100%;
    span {
      font-size: ${({ theme }) => theme.fontSizes.sm};
    }
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const StyledPanelBoxHeader = styled.div`
  margin-bottom: 2px;
  color: ${({ theme }) => theme.colors.grayDarker};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const MobileContainer = styled(Flex)<{
  props: any;
}>`
  display: flex;
  align-items: center;
  border-radius: 0.25rem;
  width: 100%;
  background: ${({ theme, heading }) =>
    heading ? 'transparent' : theme.colors.grayBorderToggle};
  padding: ${({ theme, heading }) =>
    heading ? '0 0.5rem 0 0' : theme.space[2]};
  min-width: ${({ heading }) => (heading ? 'max-content' : '150px')};
  height: ${({ autoHeight }) => (autoHeight ? '2rem' : '3rem')};
  -webkit-box-align: center;
`;

export const MobileTableWrapper = styled(Flex)`
  gap: ${({ theme }) => theme.space[2]};
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
`;

export const DetailContentWrapper = styled(Box)`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
