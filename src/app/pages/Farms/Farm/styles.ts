import { Button, AccordionItem } from '@chakra-ui/react';
import styled from '@emotion/styled';
import Heading from 'app/components/Typography/Heading';

export const StyledContainer = styled(AccordionItem)<{
  staked: boolean;
}>`
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.75rem;
  border: ${({ theme }) => `1px solid ${theme.colors.grayBorderToggle}`};
  background-color: ${({ staked, theme }) =>
    staked ? theme.colors.successBg : theme.colors.bgBox};
  display: flex;
  flex-direction: column;
  height: fit-content;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: ${({ theme }) => theme.breakpoints.sm};
  }

  > * {
    margin-top: 0.5rem;
  }

  > .chakra-skeleton > *:not(.chakra-collapse) {
    margin-top: 0.5rem;
  }
`;

export const StyledFarmType = styled(Heading)`
  display: flex;
  align-items: center;
  text-align: center;
  color: white;
  margin: 0 auto;
`;

export const StyledBoostedFarmType = styled(StyledFarmType)`
  display: flex;
  gap: 0.25rem;
  color: ${({ theme }) => theme.colors.ci};
`;

export const StyledButton = styled(Button)`
  border: none;
  &:hover {
    background: ${({ theme }) => theme.colors.grayBorderToggle};
  }
`;
