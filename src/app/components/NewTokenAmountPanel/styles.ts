import { Text } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const TokenAmountPanelWrapper = styled.div`
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) =>
    `${theme.space.spacing05} ${theme.space.spacing055}`};
  background-color: ${({ theme }) => theme.colors.bgBoxLighter};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: ${({ theme }) =>
      `${theme.space.spacing05} ${theme.space.spacing03}`};
  }
`;

export const ConversionText = styled(Text)`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: ${({ theme }) =>
    `${theme.space.spacing02} 0 ${theme.space.spacing01} ${theme.space.spacing03}`};
  line-height: ${({ theme }) => theme.lineHeights.sm};
`;
