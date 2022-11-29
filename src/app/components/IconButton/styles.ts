import styled from 'styled-components';
import { Button, ButtonProps } from '../Button';
import { StyleProps } from './IconButton.d';

export const StyledButton = styled(Button)<StyleProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: ${({ iconPos }) =>
    iconPos === 'right' ? 'row-reverse' : 'row'};

  ${({ iconOnly, size }) => {
    if (iconOnly) {
      switch (size) {
        case 'big':
          return 'padding: 7px'; // 8px - border_width
        case 'small':
          return 'padding: 3px'; // 4px - border_width
        default:
          return 'padding: 5px'; // 6px - border_width
      }
    }
  }};
`;

export const StyledImage = styled.div<StyleProps & ButtonProps>`
  display: flex;
  align-items: center;

  ${({ size, theme }) => {
    let length: string;
    switch (size) {
      case 'big':
        length = theme.spacing.spacing06;
        break;
      case 'small':
        length = theme.spacing.spacing055;
        break;
      default:
        length = theme.spacing.spacing055;
        break;
    }
    return `
      &,
      & > div,
      & > svg, 
      & > img {
        width: ${length};
        height: ${length};
      }      
    `;
  }};

  ${({ iconOnly, iconPos, theme }) =>
    !iconOnly &&
    (iconPos === 'right'
      ? `margin-right: ${theme.spacing.spacing02}`
      : `margin-left: ${theme.spacing.spacing02}`)};
`;
