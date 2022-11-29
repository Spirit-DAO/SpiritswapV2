import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-inline: auto;
  margin-top: 96px;
  width: 100%;
`;

export const StyledBottom = styled.div`
  background-color: ${({ theme }) => theme.color.ci};
  height: 4px;
  border-radius: 4px;
`;

export const StyledInfoTab = styled.div`
  background: rgb(100, 221, 192, 0.15);
  border-radius: 16px;
  flex-grow: 1;
  align-self: stretch;
`;

export const StyledInfo = styled.div``;
