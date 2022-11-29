import { FC } from 'react';
import { Props } from './ProgressBar.d';
import { StyledContainer, StyledIndicator } from './styles';

const ProgressBar: FC<Props> = ({ value }: Props) => (
  <StyledContainer>
    <StyledIndicator value={Math.min(Math.max(value, 0), 100)} />
  </StyledContainer>
);

export default ProgressBar;
