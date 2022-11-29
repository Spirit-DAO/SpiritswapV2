import { Token } from 'app/interfaces/General';

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
  getLimitTokenSymbol: () => string;
}
