import type { SelectProps } from '../Select';

export interface Props extends SelectProps {
  customPlaceholder?: string;
  customValue?: string;
  onChange?: ({ index: number, value: string, custom: boolean }) => void;
}
