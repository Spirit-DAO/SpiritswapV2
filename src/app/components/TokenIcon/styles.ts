import styled from 'styled-components';
import type { StyledProps } from './TokenIcon.d';

export const StyledWrapperDiv = styled.div<StyledProps>`
  display: inline-block;

  svg {
    display: block;

    ${({ size, theme }) => {
      let length;
      switch (size) {
        case 'big':
          length = theme.spacing.spacing07;
          break;
        case 'small':
          length = theme.spacing.spacing05;
          break;
        default:
          if (
            typeof size === 'number' ||
            (!isNaN(Number(size)) && !isNaN(parseFloat(size)))
          ) {
            length = `${size}px`;
          } else {
            length = size;
          }
      }
      return `
      & {
        width: ${length};
        height: ${length};
      }      
    `;
    }};

    ${({ svgColor }) => {
      switch (svgColor) {
        case 'white':
          return 'filter: brightness(0) invert(1)';
        case 'black':
          return 'filter: brightness(0)';
        case 'default':
        default:
          return undefined;
      }
    }};
  }
`;
