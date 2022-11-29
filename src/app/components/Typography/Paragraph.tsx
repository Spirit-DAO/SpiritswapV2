import { FC } from 'react';
import { Props } from './Paragraph.d';
import { StyledParagraph } from './styles';

const Paragraph: FC<Props> = ({ children, sub = false, variant, ...props }) => {
  return (
    <StyledParagraph sub={`${sub}`} variant={variant} {...props}>
      {children}
    </StyledParagraph>
  );
};

export default Paragraph;
