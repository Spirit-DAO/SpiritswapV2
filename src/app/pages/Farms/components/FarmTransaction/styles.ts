// import styled from 'styled-components';
import styled from '@emotion/styled';
import { Heading } from 'app/components/Typography';

export const StylesContainer = styled.div<{
  staked: boolean;
}>`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.75rem;
  border: ${({ theme }) => `1px solid ${theme.colors.grayBorderToggle}`};
  background-color: ${({ staked, theme }) =>
    staked ? theme.colors.successBg : theme.colors.bgBox};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: fit-content;

  > * {
    margin-top: 0.5rem;
  }
`;

export const StyledAmountStaked = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledHeading = styled(Heading)`
  padding-left: ${({ theme }) => theme.space.spacing02};
  margin-bottom: ${({ theme }) => theme.space.spacing02};
`;
