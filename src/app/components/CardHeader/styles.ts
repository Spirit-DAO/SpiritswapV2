import styled from '@emotion/styled';
import { Icon } from 'app/components/Icon';

export const StyledIcon = styled(Icon)<{
  hideBackground?: boolean;
}>`
  color: ${({ theme }) => `${theme.colors.ci}`};
  background: ${({ theme, hideBackground }) =>
    hideBackground ? 'none' : `${theme.colors.ciTrans15}`};
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  /* padding: ${({ theme }) => `${theme.space.spacing02}`}; */
  padding: 0;
`;
