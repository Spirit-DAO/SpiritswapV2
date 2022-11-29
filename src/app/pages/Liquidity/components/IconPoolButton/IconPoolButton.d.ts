import { ReactNode } from 'react';
import { ButtonProps } from 'app/components/Button';
import { TokenPool } from 'app/interfaces/General';

export interface StyleProps {
  iconOnly?: boolean;
  iconPos?: 'left' | 'right';
}

export interface Props extends ButtonProps {
  label?: ReactNode;
  icon?: ReactNode;
  iconPos?: 'left' | 'right';
  poolItem: TokenPool | undefined;
}
