import { Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledRangeNotification = styled(Flex)`
  padding: ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.bgBoxLighter};
  width: 100%;
  justify-content: center;
  text-align: center;
`;

export const StyledWarningNotification = styled(StyledRangeNotification)`
  background-color: ${({ theme }) => theme.colors.warningBg};
  color: ${({ theme }) => theme.colors.warning};
`;

export const StyledErrorNotification = styled(StyledRangeNotification)`
  background-color: ${({ theme }) => theme.colors.errorBg};
  color: ${({ theme }) => theme.colors.error};
`;
