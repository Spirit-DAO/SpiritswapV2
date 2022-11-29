import { Panel } from 'app/components/Panel';
import styled from 'styled-components';
import { Box } from '@chakra-ui/react';
import { IconToInput } from 'app/components/IconToInput';

export const StyledPanel = styled(Panel)`
  overflow: hidden;
  margin-top: 12px;
`;

export const StyledHeader = styled(Box)`
  display: flex;
  align-items: center;
`;

export const StyledContent = styled(Box)`
  padding: 1.5rem;
`;

export const StyledOpenOrderCount = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.color.gray};
  margin-top: 15px;
  margin-bottom: ${({ theme }) => theme.spacing.spacing02};
`;

export const StyledIconToInput = styled(IconToInput)`
  justify-content: flex-end;
  flex: 1;
  margin-left: 0.625rem;
  margin-top: ${({ theme }) => theme.spacing.spacing05};
  margin-bottom: ${({ theme }) => theme.spacing.spacing02};
`;
