import { Token } from 'app/interfaces/General';
import { Token as TokenV3 } from '../../../v3-sdk';

export interface Props {
  isLoading: boolean;
  priceImpact: string | number;
  onChange: (event: any) => void;
  typeLimit: string;
  baseLimit?: string;
  token: {
    value: string;
    limitbuy?: string;
    receive?: string;
    limitsell?: string;
    tokenSelected: Token;
  };
  limitValue: string;
  token0: TokenV3 | undefined;
  token1: TokenV3 | undefined;
  getLimitTokenSymbol: () => string;
  tickSpacing: number;
  initialSellPrice: string;
  tickStep: (direction: -1 | 1) => void;
  plusDisabled: boolean;
  minusDisabled: boolean;
}
