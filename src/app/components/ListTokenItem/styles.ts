import styled from '@emotion/styled';

export const TokenContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 10px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.grayBorderToggle};
    cursor: pointer;
  }
`;
