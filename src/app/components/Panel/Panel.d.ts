import { ReactNode } from 'react';

export interface StyledProps {
  hasFooter: boolean;
}

export interface Props {
  children?: ReactNode;
  footer?: ReactNode;
}
