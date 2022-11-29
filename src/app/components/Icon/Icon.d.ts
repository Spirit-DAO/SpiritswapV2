import { ReactNode } from 'react';

export interface StyledProps {
  size: number | string | 'big' | 'small' | 'normal';
  clickable?: boolean;
}

export interface Props extends StyledProps {
  icon: ReactNode;
}
