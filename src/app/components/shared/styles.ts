import { css } from 'styled-components';
import { transitions } from 'theme/base/transitions';
import { opacity } from 'theme/base/opacity';

export const animated = () => css`
  &,
  & > * {
    transition: ${transitions.default};
  }
`;

export const disabled = () => css`
  opacity: ${opacity.opacity04};
  cursor: not-allowed;
`;
