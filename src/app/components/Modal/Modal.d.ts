import { ReactNode } from 'react';

export interface Props {
  title?: string;
  showClose?: boolean;
  children: ReactNode;
  onClose: () => void;
}
