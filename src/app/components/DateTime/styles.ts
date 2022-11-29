import styled from 'styled-components';

export const StyledTime = styled.time<{ color?: string }>`
  color: ${({ theme, color }) => color || theme.color.white};
`;
