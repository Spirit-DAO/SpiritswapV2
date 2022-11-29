import { FC } from 'react';
import { Props } from './Icon.d';
import { StyledWrapper } from './styles';

const Icon: FC<Props> = ({ size, icon, ...props }: Props) => {
  return (
    <StyledWrapper size={size} {...props}>
      {icon}
    </StyledWrapper>
  );
};

export default Icon;
