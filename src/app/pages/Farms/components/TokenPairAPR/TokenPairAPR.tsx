import { FC } from 'react';
import { TokenIcon } from 'app/components/TokenIcon';
import { Props } from './TokenPairAPR.d';
import {
  StyledContainer,
  StyledTokenName,
  StyledTokensWrapper,
  StyledLabel,
  StyledTokenIcons,
  StyledTokenNames,
  StyledPercentBadge,
  StyledAprWrapper,
} from './styles';

const TokenPairAPR: FC<Props> = ({ tokens, label, apr }: Props) => {
  if (tokens?.length !== 2) {
    return null;
  }

  return (
    <StyledContainer data-testid="TokenPairAPR">
      <StyledTokensWrapper>
        <StyledTokenIcons>
          <TokenIcon token={tokens[0]} />
          <TokenIcon token={tokens[1]} />
        </StyledTokenIcons>
        <StyledTokenNames>
          <StyledTokenName level={3}>{tokens[0]}</StyledTokenName>
          <StyledTokenName level={3}>{tokens[1]}</StyledTokenName>
        </StyledTokenNames>
      </StyledTokensWrapper>
      <StyledAprWrapper>
        <StyledLabel>{label}</StyledLabel>
        <StyledPercentBadge showIcon={false} amount={apr} sign={0} />
      </StyledAprWrapper>
    </StyledContainer>
  );
};

export default TokenPairAPR;
