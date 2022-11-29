import { HTMLProps, MouseEventHandler, ReactNode } from 'react';

export interface StyledIconWrapperStyleProps {
  disabled: boolean;
}

export interface InputWrapperStyleProps {
  hasIconPrefix: boolean;
  hasIconSuffix: boolean;
  disabled: boolean;
}

export interface Props extends HTMLProps<HTMLInputElement> {
  iconPrefix?: ReactNode;
  iconSuffix?: ReactNode | 'delete';
  onClickIconSuffix?: MouseEventHandler;
  disabled?: boolean;
  fullWidth?: boolean;
}
