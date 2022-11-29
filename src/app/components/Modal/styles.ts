import styled from 'styled-components';
import { Panel } from '../Panel';
import { IconButton } from '../IconButton';

export const StyledPanel = styled(Panel)`
  padding: ${({ theme }) => theme.spacing.spacing05};
`;

export const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const TitleLabel = styled.label`
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.h2};
  line-height: ${({ theme }) => theme.lineHeight.h2};
  color: ${({ theme }) => theme.color.white};
`;

export const StyledIconButton = styled(IconButton)`
  background: transparent;
  padding: 0;

  &:active {
    border-color: transparent;
  }
`;

export const BodyContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.spacing03};
`;
