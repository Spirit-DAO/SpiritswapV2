import styled from 'styled-components';
import { Box, NumberInput } from '@chakra-ui/react';

export const ImpactContainer = styled(Box)`
  margin: ${({ theme }) =>
    `${theme.spacing.spacing03} -${theme.spacing.spacing04} -${theme.spacing.spacing05} -${theme.spacing.spacing04}`};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.md};
  width: auto;
  padding: ${({ theme }) =>
    `0 ${theme.spacing.spacing04} 0 ${theme.spacing.spacing02}`};
`;

export const LimitInput = styled(NumberInput)`
  height: 56px;
`;
