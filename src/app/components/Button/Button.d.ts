import { HTMLAttributes } from 'react';

export interface StyleProps {
  variant?: 'primary' | 'danger' | 'secondary' | 'inverted' | 'transparent';
  size?: 'default' | 'big' | 'small';
  disabled?: boolean;
  flat?: boolean;
}

export interface Props extends HTMLAttributes<HTMLButtonElement>, StyleProps {}
