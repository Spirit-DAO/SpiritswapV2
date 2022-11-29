import { Panel } from 'app/components/Panel';
import styled from '@emotion/styled';
import { IconToInput } from 'app/components/IconToInput';

export const StyledPanel = styled(Panel)`
  overflow: hidden;
  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    margin-bottom: 12px;
  }
`;

export const StyledContent = styled.div`
  padding: 1.5rem;
`;

export const StyledIconToInput = styled(IconToInput)`
  justify-content: flex-end;
  flex: 1;
  margin-left: 0.625rem;
`;
