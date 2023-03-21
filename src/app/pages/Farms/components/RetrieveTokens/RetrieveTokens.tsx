import React from 'react';
import {
  StyledContainer,
  StyledParagraph,
  StyledValue,
  StyledHighlightValue,
} from './styles';

import { formatAmount } from 'app/utils';
import { Box, Skeleton } from '@chakra-ui/react';

export const RetrieveTokens = ({
  highlight = false,
  value,
  isConcentrated = false,
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
        <Box mb="3px">
          {isConcentrated ? (
            value ? (
              <StyledHighlightValue>{value}</StyledHighlightValue>
            ) : (
              <Skeleton
                startColor="grayBorderBox"
                endColor="bgBoxLighter"
                w="100px"
                h="16px"
              />
            )
          ) : highlight ? (
            <StyledValue>
              {isConcentrated ? value : formatAmount(value, 6)}
            </StyledValue>
          ) : (
            <StyledHighlightValue>
              {isConcentrated ? value : formatAmount(value, 6)}
            </StyledHighlightValue>
          )}
        </Box>
        <StyledParagraph color="grayDarker">
          {moneyValue ? (
            preParsed ? (
              moneyValue
            ) : (
              `$${moneyValue}`
            )
          ) : (
            <Skeleton
              startColor="grayBorderBox"
              endColor="bgBoxLighter"
              w="50px"
              h="16px"
            />
          )}
        </StyledParagraph>
      </div>
      <div>{button}</div>
    </StyledContainer>
  );
};
