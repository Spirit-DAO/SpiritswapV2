import styled from 'styled-components';
import { animated, disabled as disabledStyles } from 'app/components/shared';
import type { StyleProps } from './IconToInput.d';

export const StyledWrapper = styled.div<StyleProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  flex-direction: ${({ iconPos }) =>
    iconPos === 'right' ? 'row-reverse' : 'row'};

  &,
  & > div {
    width: 100%;
  }

  ${animated}

  ${({ disabled, open }) => disabled && !open && disabledStyles}
`;
