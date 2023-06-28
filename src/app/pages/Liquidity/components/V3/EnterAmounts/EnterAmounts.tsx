import { Currency, CurrencyAmount } from '../../../../../../v3-sdk';

import { Field } from 'store/v3/mint/actions';
import {
  IDerivedMintInfo,
  useV3MintActionHandlers,
  useV3MintState,
} from 'store/v3/mint/hooks';
import { maxAmountSpend } from '../../../../../../v3-sdk/functions';

import { useMemo } from 'react';
import { TokenAmountPanel } from 'app/components/NewTokenAmountPanel';
import { Flex } from '@chakra-ui/react';
import { StyledDisabledDeposit } from './styled';

interface IEnterAmounts {
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
  mintInfo: IDerivedMintInfo;
  isCompleted: boolean;
  additionalStep: boolean;
  backStep: number;
  firstToken: any;
  handleChangeInput: Function;
  secondToken: any;
}

export function EnterAmounts({
  currencyA,
  currencyB,
  mintInfo,
  firstToken,
  secondToken,
  handleChangeInput,
  isCompleted,
  additionalStep,
  backStep,
}: IEnterAmounts) {
  const { independentField, typedValue } = useV3MintState();

  const { onFieldAInput, onFieldBInput } = useV3MintActionHandlers(
    mintInfo.noLiquidity,
  );

  const formattedAmounts = {
    [independentField]: typedValue,
    [mintInfo.dependentField]:
      mintInfo.parsedAmounts[mintInfo.dependentField]?.toSignificant(6) ?? '',
  };

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(mintInfo.currencyBalances[field]),
    };
  }, {});

  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmounts[field]?.equalTo(mintInfo.parsedAmounts[field] ?? '0'),
    };
  }, {});

  const currencyAError = useMemo(() => {
    if (
      (mintInfo.errorCode !== 4 && mintInfo.errorCode !== 5) ||
      !mintInfo.errorMessage ||
      !currencyA
    )
      return;

    const erroredToken = mintInfo.errorMessage.split(' ')[1];
    const erroredSymbol = currencyA.isNative
      ? currencyA.symbol
      : currencyA.wrapped.symbol;

    if (erroredSymbol === erroredToken) return mintInfo.errorMessage;

    return;
  }, [mintInfo, currencyA]);

  const currencyBError = useMemo(() => {
    if (
      (mintInfo.errorCode !== 5 && mintInfo.errorCode !== 4) ||
      !mintInfo.errorMessage ||
      !currencyB
    )
      return;

    const erroredToken = mintInfo.errorMessage.split(' ')[1];

    if (currencyB.wrapped.symbol === erroredToken) return mintInfo.errorMessage;

    return;
  }, [mintInfo, currencyB]);

  return (
    <Flex direction={'column'} gap={4}>
      <Flex position="relative">
        <TokenAmountPanel
          key="tokenA"
          isSelectable={false}
          inputValue={formattedAmounts[Field.CURRENCY_A]}
          context="token"
          token={firstToken?.tokenSelected}
          onChange={({ value }) => onFieldAInput(value)}
          errorMessage={currencyAError}
        />
        {mintInfo.depositADisabled && (
          <StyledDisabledDeposit>
            For selected range this deposit is disabled
          </StyledDisabledDeposit>
        )}
      </Flex>
      <Flex position="relative">
        <TokenAmountPanel
          key="tokenB"
          isSelectable={false}
          inputValue={formattedAmounts[Field.CURRENCY_B]}
          context="token"
          token={secondToken?.tokenSelected}
          onChange={({ value }) => onFieldBInput(value)}
          errorMessage={currencyBError}
        />
        {mintInfo.depositBDisabled && (
          <StyledDisabledDeposit>
            For selected range this deposit is disabled
          </StyledDisabledDeposit>
        )}
      </Flex>
    </Flex>
  );
}
