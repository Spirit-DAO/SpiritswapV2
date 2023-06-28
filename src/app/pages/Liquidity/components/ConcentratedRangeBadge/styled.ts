import styled from '@emotion/styled';

export const StyledRangeBadge = styled.div<{
  inRange: boolean;
  isRemoved: boolean;
}>`
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
    background-color: ${({ theme, inRange, isRemoved }) =>
      isRemoved
        ? theme.colors.gray
        : inRange
        ? theme.colors.teal[400]
        : theme.colors.red[500]};
  }
`;
