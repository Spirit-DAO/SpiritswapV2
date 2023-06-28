import { Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const StyledCurrentPriceWrapper = styled(Flex)`
  padding: ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.bgBoxLighter};
  border: 1px solid ${({ theme }) => theme.colors.grayBorderBox};
`;

export const StyledCurrentPrice = styled.div`
  background-color: ${({ theme }) => theme.colors.successBg};
  color: ${({ theme }) => theme.colors.ci};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: 4px 6px;
`;
