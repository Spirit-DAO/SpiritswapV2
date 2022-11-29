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

export const StyledBox = styled.div`
  background-color: ${({ theme }) => theme.colors.bgBoxLighter};
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
`;

export const StyledInsideChartText = styled.div`
  position: absolute;
  top: 105px;
  left: 85px;
  font-size: 16px;
  max-width: 120px;
`;
