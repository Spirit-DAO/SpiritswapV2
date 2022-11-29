import styled from 'styled-components';
import { StyledProps } from './Icon.d';

export const StyledWrapper = styled.div<StyledProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ size, theme }) => {
    let length;
    switch (size) {
      case 'big':
        length = theme.spacing.spacing07;
        break;
      case 'normal':
        length = theme.spacing.spacing06;
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
      &,
      & > div,
      & > svg,
      & > img {
        width: ${length};
        height: ${length};
      }
    `;
  }};

  display: flex;
  cursor: ${({ clickable = true }) => (clickable ? 'pointer' : 'default')};
`;
