import styled from '@emotion/styled';

export const StyledFarmingBadge = styled.div`
  color: white;
  position: relative;
  font-size: 14px;

  &:before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    top: calc(50% - 5px);
    background-color: ${({ theme }) => theme.colors.blue[400]};
  }
`;
