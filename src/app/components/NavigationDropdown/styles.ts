import { VStack } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

const baseStyle = css`
  text-decoration: none;
  color: ${({ theme }) => theme.color.white};
  font-size: ${({ theme }) => theme.fontSize.h4};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  width: 100%;
  padding: ${({ theme }) =>
    `${theme.spacing.spacing02} ${theme.spacing.spacing03}`};
  line-height: ${({ theme }) => theme.lineHeight.baseLg};
  &.active {
    color: ${({ theme }) => theme.color.ci};
    background: ${({ theme }) => theme.color.ciTrans15};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  &.active svg {
    color: ${({ theme }) => theme.color.ci};
  }
  &:hover {
    background: ${({ theme }) => theme.color.grayBorderBox};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

export const CommonLink = styled.a`
  ${baseStyle}
  white-space:nowrap;
`;

export const StyledNavLink = styled(NavLink)`
  ${baseStyle}
  white-space:nowrap;
`;

export const DropdownWrapper = styled.div<{ width }>`
  display: flex;
  width: ${({ width }) => width}px;
  justify-content: center;
  background: ${({ theme }) => theme.color.bgBox};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  z-index: 999;
`;

export const ColumnWrapper = styled(VStack)`
  flex: 1;
  margin-bottom: 8px;
  margin-right: 10px;
  margin-left: 10px;
  align-items: flex-start;
  font-size: ${({ theme }) => theme.fontSize.base};
`;

export const StyledColumnHeading = styled.div`
  margin-top: ${({ theme }) => theme.spacing.spacing03};
  margin-left: ${({ theme }) => theme.spacing.spacing03};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.color.gray};
`;
