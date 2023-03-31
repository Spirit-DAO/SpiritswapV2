import styled from 'styled-components';

export const StyledContainer = styled.div`
  height: 8px;
  background-image: linear-gradient(to right, rgba(0, 0, 0), rgba(67, 67, 67));
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  position: relative;
  filter: drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.5));
`;

export const StyledIndicator = styled.div<{ value: number }>`
  height: 100%;
  width: ${({ value }) => `${value}%`};
  border-radius: ${({ value, theme }) =>
    value === 100
      ? theme.borderRadius.sm
      : `${theme.borderRadius.sm} 0px 0px ${theme.borderRadius.sm}`};
  -webkit-mask: linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(to right, #000000, #434343);
  }
`;
