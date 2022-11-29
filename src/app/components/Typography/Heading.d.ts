import { HTMLAttributes } from 'react';

export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

export interface Props extends HTMLAttributes<HTMLHeadingElement> {
  as?: keyof JSX.IntrinsicElements;
  level?: 1 | 2 | 3 | 4 | 5; // h1, h2, h3, h4, h5
}
