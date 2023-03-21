import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const StyledContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 54px;
  background-color: ${({ theme }) => theme.colors.bgBoxLighter};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.5rem 0.25rem 0.5rem 0.5rem;
`;
