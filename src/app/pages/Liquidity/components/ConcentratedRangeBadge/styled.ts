import styled from '@emotion/styled';

export const StyledRangeBadge = styled.div<{ inRange: boolean }>`
  color: white;
  position: relative;
  font-size: 14px;

  &:before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    top: calc(50% - 4px);
    background-color: ${({ theme, inRange }) =>
      inRange ? theme.colors.teal[400] : theme.colors.red[500]};
  }
`;
