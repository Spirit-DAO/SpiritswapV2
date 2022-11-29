import styled from '@emotion/styled';
import { Icon } from 'app/components/Icon';

export const StyledListItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.spacing04};

  h3 {
    color: ${({ theme }) => theme.colors.white};
  }

  p {
    margin-top: ${({ theme }) => theme.space.spacing02};
    color: ${({ theme }) => theme.colors.gray};
    line-height: ${({ theme }) => theme.lineHeights.base};
  }
`;

// TODO: to remove once its removed from voting
export const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.ci};
  background: ${({ theme }) => theme.colors.ciTrans15};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.space.spacing01};
`;

export const StyledTitleWrapper = styled.div`
  display: flex;
  align-items: center;

  h2 {
    line-height: 1;
  }

  svg {
    color: ${({ theme }) => theme.colors.grayDarker};
  }
`;
