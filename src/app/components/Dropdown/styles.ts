import styled from 'styled-components';
import type { ButtonProps } from './Dropdown.d';

export const Wrapper = styled.div`
  position: absolute;
  z-index: 1;
  width: max-content;
  max-height: 194px;
  overflow: auto;
  padding: ${({ theme }) => theme.spacing.spacing02};
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.bgBoxLighter};
  box-shadow: ${({ theme }) => theme.boxShadow.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const Button = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  text-decoration: none;
  text-align: left;
  background: ${({ isSelected, theme }) =>
    isSelected ? theme.color.ciTrans15 : 'transparent'};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.color.ci : theme.color.white};
  font-size: ${({ theme }) => theme.fontSize.h4};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  padding: ${({ theme }) =>
    `${theme.spacing.spacing02} ${theme.spacing.spacing03} ${theme.spacing.spacing02} 10px`};
  line-height: ${({ theme }) => theme.lineHeight.baseLg};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    background: ${({ isSelected, theme }) =>
      !isSelected && theme.color.grayBorderBox};
  }
`;
