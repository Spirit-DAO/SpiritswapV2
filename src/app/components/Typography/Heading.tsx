import { FC } from 'react';
import { StyledHeading } from './styles';
import { Props } from './Heading.d';

const Heading: FC<Props> = ({ level = 1, ...props }) => {
  return <StyledHeading level={level} {...props} />;
};

export default Heading;
