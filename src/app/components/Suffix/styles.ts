import styled from 'styled-components';
import { StyledProps } from './Suffix.d';

export const StyledContainer = styled.div<StyledProps>`
  display: inline-grid;
  grid-auto-flow: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.spacing03};
`;
