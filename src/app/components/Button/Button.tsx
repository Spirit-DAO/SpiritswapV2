import { FC } from 'react';
import { Props } from './Button.d';
import StyledContainer from './styles';

const Button: FC<Props> = ({
  variant = 'primary',
  size = 'default',
  disabled = false,
  flat = false,
  ...props
}: Props) => (
  <StyledContainer
    variant={variant}
    size={size}
    disabled={disabled}
    flat={flat}
    {...props}
  />
);

export default Button;
