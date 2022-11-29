import React from 'react';
import {
  StyledContainer,
  StyledParagraph,
  StyledValue,
  StyledHighlightValue,
} from './styles';

import { formatAmount } from 'app/utils';

export const RetrieveTokens = ({
  highlight = false,
  value,
  moneyValue,
  title,
  button,
  style = {},
  preParsed = false,
}) => {
  return (
    <StyledContainer style={style}>
      <div>
        <StyledParagraph>{title}</StyledParagraph>
        {highlight ? (
          <StyledValue>{formatAmount(value, 6)}</StyledValue>
        ) : (
          <StyledHighlightValue>{formatAmount(value, 6)}</StyledHighlightValue>
        )}
        <StyledParagraph color="grayDarker">
          {preParsed ? moneyValue : `$${moneyValue}`}
        </StyledParagraph>
      </div>
      <div>{button}</div>
    </StyledContainer>
  );
};
