import { ReactNode } from 'react';

export interface Props {
  children?: ReactNode;
  labels: ReactNode[];
  selected?: number;
  disabled?: boolean;
  onChange?: ({ index: number, value: string }) => void;
}
