import { PoolData } from 'app/utils/data';

import type { Currency, Token } from 'app/utils';
import type {
  Wallet,
  TokenValue,
  TokenCurrencyConversionRateMap,
} from 'app/utils';
export interface TokenAmountPanelProps {
  limitSwapEnabled: boolean;
}

export interface Props {
  tokenConversionRates?: TokenCurrencyConversionRateMap;

  // if undefined, the component will show as "disconnected" wallet
  wallet?: Wallet;
  currency: Currency;
  direction?: 'in' | 'out' | undefined;
  limitSwap?: 'sell' | 'buy' | undefined | false;
  defaultSelectedToken?: Token;
  showPercentage?: boolean;
  value?: TokenValue;
  onChange?: (value: TokenValue) => void;
  onClick?: () => void;
  canSelect?: boolean;
  liquidityPools?: PoolData[];
}
