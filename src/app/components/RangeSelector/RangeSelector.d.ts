import { Price, Token, Currency } from '../../../v3-sdk';
// import { IDervivedMintInfo } from 'hooks/v3'

export interface Props {
  priceLower: Price<Token, Token> | undefined;
  priceUpper: Price<Token, Token> | undefined;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  getDecrementLower: () => string;
  getIncrementLower: () => string;
  getDecrementUpper: () => string;
  getIncrementUpper: () => string;
  currencyA: Currency | null | undefined;
  currencyB: Currency | null | undefined;
  initial: boolean;
  disabled: boolean;
  isBeforePrice: boolean;
  isAfterPrice: boolean;
  mintInfo: IDerivedMintInfo;
}
