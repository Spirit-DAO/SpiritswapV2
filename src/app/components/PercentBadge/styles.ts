import styled from 'styled-components';
import { Sign } from 'app/utils';
import { StyleProps } from './PercentBadge.d';

export const StyledContainer = styled.span<StyleProps>`
  // TODO Update with theme
  display: inline-flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-family: ${({ theme }) => theme.fontFamily.sans};
  padding: ${({ theme }) =>
    `${theme.spacing.spacing01} ${theme.spacing.spacing02}`};

  ${({ sign, theme }) => {
    const colors = {
      [Sign.POSITIVE]: {
        color: theme.color.ci,
        bgColor: theme.color.ciTrans15,
      },
      [Sign.NEUTRAL]: {
        color: theme.color.white,
        bgColor: theme.color.grayBorderBox,
      },
      [Sign.NEGATIVE]: {
        color: theme.color.danger,
        bgColor: theme.color.dangerBg,
      },
    };

    const {
      [sign]: { color, bgColor },
    } = colors;

    return `
      background-color: ${bgColor};
      color: ${color};
    `;
  }};
`;
