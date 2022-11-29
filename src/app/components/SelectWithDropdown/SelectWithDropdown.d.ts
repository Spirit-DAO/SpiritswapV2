import { ReactNode } from 'react';

export interface Props {
  items: { id: number | string; value: string; type: string }[];
  selectedId: number | string;
  icon?: ReactNode;
  onSelect: (selectedId) => void;
  label?: string;
}
