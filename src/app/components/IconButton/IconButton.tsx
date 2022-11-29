import { FC } from 'react';
import { Props } from './IconButton.d';
import { StyledButton, StyledImage } from './styles';

const IconButton: FC<Props> = ({
  label,
  icon,
  iconPos = 'left',
  size = 'default',
  ...props
}: Props) => {
  const iconOnly = !label && !!icon;

  return (
    <StyledButton iconOnly={iconOnly} iconPos={iconPos} size={size} {...props}>
      {label}
      {icon && (
        <StyledImage iconOnly={iconOnly} iconPos={iconPos} size={size}>
          {icon}
        </StyledImage>
      )}
    </StyledButton>
  );
};

export default IconButton;
