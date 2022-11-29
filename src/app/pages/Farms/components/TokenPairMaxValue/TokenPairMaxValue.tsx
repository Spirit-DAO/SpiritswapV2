import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'app/components/Button';
import { Props } from './TokenPairMaxValue.d';
import { AmountTypes, validateInput } from 'app/utils';
import {
  FormControl,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import {
  StyledContainer,
  StyledMaxValueWrapper,
  StyledTokensValueWrapper,
  StyledTokensNameWrapper,
  StyledValueWrapper,
  StyledTokensName,
  StyledSubLabel,
} from './styles';

import { NON_ZERO, NOT_ENOUGH_FUNDS } from 'constants/errors';

const TokenPairMaxValue = ({
  value,
  moneyValue,
  tokens,
  amountValue,
  amountType,
  onMaxClick,
  onchange,
  amountStaked,
}: Props) => {
  const { t } = useTranslation();
  const translationPath = 'common.tokenPairMaxValue';
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!value) {
      setErrorMessage(NON_ZERO);
    } else if (Number(value) > Number(amountStaked)) {
      setErrorMessage(NOT_ENOUGH_FUNDS);
    } else {
      setErrorMessage('');
    }
  }, [value, onchange, amountStaked]);

  if (tokens?.length !== 2) {
    return null;
  }

  const amountLabel =
    amountType === AmountTypes.BALANCE || amountType === AmountTypes.STAKED
      ? `${t(`${translationPath}.${amountType}`)}: `
      : '';

  return (
    <StyledContainer data-testid="TokenPairMaxValue">
      <StyledTokensValueWrapper>
        <FormControl>
          <NumberInput
            value={value}
            onChange={value => {
              const validInput = validateInput(value);
              onchange(validInput);
            }}
            w="100%"
            px="0"
            textAlign="left"
            placeholder={t(`${translationPath}.enterAmount`)}
            min={0}
            isInvalid={!!errorMessage}
          >
            <NumberInputField w="full" />
          </NumberInput>
        </FormControl>
        <StyledSubLabel alignment="left" sub>
          {moneyValue}
        </StyledSubLabel>
        {errorMessage && (
          <Text color="red.500" mb="spacing03">
            {t(errorMessage)}
          </Text>
        )}
      </StyledTokensValueWrapper>
      <StyledTokensNameWrapper>
        <StyledValueWrapper>
          <StyledMaxValueWrapper>
            <Button onClick={onMaxClick} variant="secondary">
              {t(`${translationPath}.max`)}
            </Button>
          </StyledMaxValueWrapper>
          <StyledTokensName level={2}>
            {tokens[0]}
            <br />
            {tokens[1]}
          </StyledTokensName>
        </StyledValueWrapper>
        {!!amountValue && (
          <StyledSubLabel
            alignment="right"
            sub
          >{`${amountLabel}${amountValue}`}</StyledSubLabel>
        )}
      </StyledTokensNameWrapper>
    </StyledContainer>
  );
};

export default TokenPairMaxValue;
