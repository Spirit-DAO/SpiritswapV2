import styled from 'styled-components';

export const ContainerStyled = styled.div<{ gridArea?: string }>`
  padding-top: 140px;
  padding-bottom: 175px;
  max-width: ${({ theme }) => theme.breakpoints.xl};
  margin: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 0fr auto;
    gap: 4px 5px;
    grid-template-areas:
      'Card Chart Chart'
      '. Positions Positions';
  }
`;
