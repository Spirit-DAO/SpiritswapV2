import type { Token } from 'types/crypto/token';

export interface StyledProps {
  size: number | string | 'big' | 'small';
  svgColor: 'default' | 'white' | 'black';
}

export interface Props {
  size?: number | string | 'big' | 'small';
  svgColor?: 'default' | 'white' | 'black';
  token: Token;
}
