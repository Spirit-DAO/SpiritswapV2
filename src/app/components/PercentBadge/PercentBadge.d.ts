import { HTMLAttributes } from 'react';
import { Sign } from 'app/utils';

export interface StyleProps {
  sign: Sign;
  amount: string | number;
  showIcon?: boolean;
}

export interface Props extends HTMLAttributes<HTMLSpanElement>, StyleProps {}
