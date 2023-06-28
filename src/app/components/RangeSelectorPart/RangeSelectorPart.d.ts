import { Currency, Price, Token } from 'v3-sdk/entities';

export interface Props {
  value: string;
  onUserInput: (value: string) => void;
  decrement: () => string;
  increment: () => string;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
  label?: string;
  width?: string;
  locked?: boolean;
  tokenA: Currency | undefined;
  tokenB: Currency | undefined;
  initialPrice: Price<Token, Token> | undefined;
  disabled: boolean;
  title: string;
}
