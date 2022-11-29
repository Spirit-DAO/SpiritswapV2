import { ReactNode, ChangeEvent } from 'react';
import { InputProps } from '../Input';

export interface StyleProps {
  open?: boolean;
  iconPos?: 'left' | 'right';
  disabled?: boolean;
}

export interface Props extends InputProps, StyleProps {
  icon?: ReactNode;
  placeholder?: string;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
}
