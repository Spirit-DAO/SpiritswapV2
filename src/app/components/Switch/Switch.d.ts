import { FlexProps } from '@chakra-ui/react';

export interface Props extends FlexProps {
  label?: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
}
