import styled from '@emotion/styled';
import { Switch } from 'app/components/Switch';

export const StyledSwitch = styled(Switch)`
  > h5 {
    padding-right: ${({ theme }) => theme.space.spacing02};
  }
`;
