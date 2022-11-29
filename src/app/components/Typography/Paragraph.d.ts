import { ReactNode } from 'react';

export interface Props {
  children: ReactNode;
  sub?: boolean;
  variant?: 'warning'; // more varaints should be here
}
