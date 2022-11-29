import styled from '@emotion/styled';

export const StyledPanel = styled.div`
  padding: 0.5rem;
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  border: ${({ theme }) => `1px solid ${theme.colors.grayBorderBox}`};
  background-color: ${({ theme }) => `${theme.colors.bgBox}`};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

export const Wrapper = styled.div`
  margin: 135px 8px 100px 8px;
  user-select: none;
  max-width: 1280px;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
    grid-template-columns: 2fr 1.25fr;
    column-gap: 8px;
    margin-inline: auto;
  }
`;
