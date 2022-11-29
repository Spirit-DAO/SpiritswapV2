import { ReactNode } from 'react';
import { ButtonProps } from '../Button';

export interface StyleProps {
  iconOnly?: boolean;
  iconPos?: 'left' | 'right';
}

export interface Props extends ButtonProps {
  label?: ReactNode;
  icon?: ReactNode;
  iconPos?: 'left' | 'right';
}
