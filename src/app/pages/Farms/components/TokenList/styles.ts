import styled from '@emotion/styled';
import { Heading } from 'app/components/Typography';
import { IconButton } from 'app/components/IconButton';

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledH3 = styled(Heading)`
  text-transform: uppercase;
  line-height: 1;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: ${({ theme }) => theme.space.spacing03};
`;

export const StyledWrapper = styled.div`
  h2,
  h3 {
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const StyledIconButton = styled(IconButton)`
  svg {
    color: ${({ theme }) => theme.colors.ci};
  }
`;
