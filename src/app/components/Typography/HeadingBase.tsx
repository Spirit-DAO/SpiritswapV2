import { FC } from 'react';
import { HeadingTag, Props } from './Heading.d';

const HeadingBase: FC<Props> = ({ level, ...props }) => {
  const Tag = `h${level}` as HeadingTag;
  return <Tag {...props} />;
};
export default HeadingBase;
