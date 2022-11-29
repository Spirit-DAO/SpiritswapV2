import styled from 'styled-components';

export const ChartContainer = styled.div<{ gridArea?: string }>`
  background: ${({ theme }) => `${theme.color.bgBox}`};
  border: 1px solid rgba(55, 65, 81, 1);
  padding: 8px;
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  height: 770px;
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;
