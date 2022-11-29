import { FC } from 'react';
import { StyledContainer } from './styles';
import { Props } from './Suffix.d';

const Suffix: FC<Props> = ({ suffix, children, ...props }: Props) => {
  return (
    <StyledContainer {...props}>
      {children}
      {suffix}
    </StyledContainer>
  );
};

export default Suffix;
