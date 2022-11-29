import { FC } from 'react';
import { Props } from './TokenEarningsBox.d';
import {
  StyledContainer,
  StyledHighlightText,
  StyledTextBottom,
  StyledTextTop,
  StyledTextCenter,
} from './styles';

export const TokenEarningsBox: FC<Props> = ({
  label,
  value,
  subLabel,
  highlight = false,
}) => {
  return (
    <StyledContainer data-testid="TokenEarningsBox">
      <StyledTextTop>{label}</StyledTextTop>
      {highlight ? (
        <StyledHighlightText>{value}</StyledHighlightText>
      ) : (
        <StyledTextCenter>{value}</StyledTextCenter>
      )}
      {subLabel && <StyledTextBottom>≈ ${subLabel}</StyledTextBottom>}
    </StyledContainer>
  );
};

export default TokenEarningsBox;
