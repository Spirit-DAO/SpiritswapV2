import React, { FC } from 'react';
import { Props } from './Panel.d';
import {
  StyledContainer,
  StyledBodyContainer,
  StyledFooterContainer,
} from './styles';

const Panel: FC<Props> = ({ children, footer, ...props }: Props) => {
  return (
    <StyledContainer hasFooter={!!footer} {...props}>
      {children && (
        <StyledBodyContainer hasFooter={!!footer}>
          {children}
        </StyledBodyContainer>
      )}
      {footer && <StyledFooterContainer>{footer}</StyledFooterContainer>}
    </StyledContainer>
  );
};

export default Panel;
