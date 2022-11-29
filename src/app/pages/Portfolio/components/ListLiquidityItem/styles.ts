import styled from '@emotion/styled';

export const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 54px;
  background-color: ${({ theme }) => theme.colors.bgBoxLighter};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.5rem;
`;
