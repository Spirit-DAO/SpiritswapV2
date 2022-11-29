import { ChangeEvent, HTMLProps, MouseEventHandler } from 'react';

export interface Props extends HTMLProps<HTMLInputElement> {
  iconPrefix?: React.ReactNode;
  iconSuffix?: React.ReactNode | 'delete';
  onClickIconSuffix?: MouseEventHandler;
  disabled?: boolean;

  value?: number;
  onChange?: (
    parsedValue: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  defaultValue?: number;
}
