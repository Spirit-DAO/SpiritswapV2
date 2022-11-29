import styled from '@emotion/styled';
import { Dropdown } from '../Dropdown';

export const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) =>
    `${theme.space.spacing02} ${theme.space.spacing03}`};
  position: relative;
  width: fit-content;
`;

export const StyledLabel = styled.label`
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  font-size: ${({ theme }) => theme.fontSizes.h4};
  white-space: nowrap;
  line-height: ${({ theme }) => theme.lineHeights.base};
  color: ${({ theme }) => theme.colors.white};
  margin-left: 6px;
  margin-right: ${({ theme }) => theme.space.spacing02};
  cursor: pointer;
`;

export const StyledDropdown = styled(Dropdown)`
  position: absolute;
  right: 0;
  top: ${({ theme }) => theme.space.spacing08};
`;
