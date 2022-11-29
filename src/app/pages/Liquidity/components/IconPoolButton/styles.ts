import styled from 'styled-components';
import { Button, ButtonProps } from 'app/components/Button';
import { StyleProps } from './IconPoolButton.d';

export const StyledButton = styled(Button)<StyleProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: ${({ iconPos }) =>
    iconPos === 'right' ? 'row' : 'row-reverse'};

  ${({ iconOnly, size }) => {
    if (iconOnly) {
      switch (size) {
        case 'big':
          return 'padding: 7px';
        case 'small':
          return 'padding: 3px';
        default:
          return 'padding: 5px';
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
      ? `margin-left: ${theme.spacing.spacing02};`
      : `margin-right: ${theme.spacing.spacing02}`)};
`;

export const StyledSpan = styled.span`
  margin-right: 8px;
`;
