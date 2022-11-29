import styled from 'styled-components';
import { SearchInput } from '../SearchInput';
import { Panel } from '../Panel';
import { ReactComponent as CloseButton } from 'app/assets/images/close.svg';

export const StyledPanel = styled(Panel)`
  padding: ${({ theme }) => theme.spacing.spacing06};
`;

export const StyledTopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const StyledTitle = styled.label`
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xl};
  line-height: ${({ theme }) => theme.lineHeight.xl};
  color: ${({ theme }) => theme.color.white};
`;

export const StyledCloseButton = styled(CloseButton)`
  color: ${({ theme }) => theme.color.white};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.ci};
  }
`;

export const StyledSearchInput = styled(SearchInput)`
  margin-top: ${({ theme }) => theme.spacing.spacing03};
  margin-bottom: ${({ theme }) => theme.spacing.spacing03};
`;
