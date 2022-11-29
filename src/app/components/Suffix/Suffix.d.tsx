import { HTMLAttributes, ReactNode } from 'react';

export interface StyledProps {}

export interface Props extends HTMLAttributes<HTMLDivElement>, StyledProps {
  children: ReactNode;
  suffix: ReactNode;
}
