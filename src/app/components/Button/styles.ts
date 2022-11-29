import styled from 'styled-components';
import { animated } from '../shared';
import { StyleProps } from './Button.d';

const StyledContainer = styled.button<StyleProps>`
  background: ${({ theme, variant }) => {
    switch (variant) {
      case 'danger':
        return theme.color.danger;
      case 'secondary':
        return theme.color.secondary;
      case 'inverted':
        return theme.color.ciTrans15;
      case 'transparent':
        return 'transparent';
      default:
        return theme.color.ciDark;
    }
  }};
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'inverted':
        return theme.color.ci;
      default:
        return theme.color.white;
    }
  }};
  border: ${({ theme, variant }) => {
    const solid = '1px solid';
    switch (variant) {
      case 'danger':
        return `${solid} ${theme.color.dangerBorder}`;
      case 'secondary':
        return `${solid} ${theme.color.secondary}`;
      case 'inverted':
        return `${solid} transparent`;
      case 'transparent':
        return '1px solid transparent';
      default:
        return `${solid} ${theme.color.ciTrans15}`;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  font-family: inherit;
  font-size: ${({ theme, size }) => {
    switch (size) {
      case 'big':
        return theme.fontSize.lg;
      default:
        return theme.fontSize.sm;
    }
  }};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  line-height: ${({ size, theme }) => {
    switch (size) {
      case 'big':
        return theme.spacing.spacing06;
      default:
        return '20px';
    }
  }};

  padding: ${({ size, theme }) => {
    switch (size) {
      case 'big':
        return theme.spacing.spacing03;
      case 'small':
        return `${theme.spacing.spacing02} ${theme.spacing.spacing03}`;
      default:
        return `6px ${theme.spacing.spacing03}`;
    }
  }};
  width: fit-content;

  cursor: pointer;

  ${({ disabled, theme, variant }) => {
    // disabled button
    if (disabled) {
      return `
      opacity: ${theme.opacity.opacity04};
      cursor: not-allowed;
    `;
    }

    let activeBorderColor;
    switch (variant) {
      case 'danger':
        activeBorderColor = theme.color.dangerLight;
        break;
      case 'secondary':
        activeBorderColor = theme.color.grayDarker;
        break;
      case 'transparent':
        activeBorderColor = 'transparent';
        break;
      default:
        activeBorderColor = theme.color.ci;
        break;
    }

    // active and hover state of non disabled button
    return `
      &:hover {
        opacity: ${theme.opacity.opacity08};
      } 
      &:active {
        border: 1px solid ${activeBorderColor};
        opacity: 1;
      }
    `;
  }};

  :not(&:active):not(&:hover) {
    ${({ flat }) =>
      flat &&
      `
      // flat button
      background: none;
      border: 1px solid transparent;
    `}
  }

  ${({ disabled, flat }) =>
    disabled &&
    flat &&
    `
      // disabled and flat button
      background: none;
      border: 1px solid transparent;
    `}

  ${animated}
`;

export default StyledContainer;
