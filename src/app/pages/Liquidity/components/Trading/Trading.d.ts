import { PoolData, tokenData } from 'app/utils/data';

export interface Props {
  title?: string;
  isDisplayBalance?: boolean;
  balancePrice?: string;
  ratePrice?: string;
  tradingAmount?: number;
  tradingTokenSymbol?: string;
  tradingActualPrice?: string;
  tradingApproxPrice?: string;
  tradingLogo?: any;
  showSwapIcon?: boolean;
  birectional?: boolean;
  limitValueName?: string;
  limitSubValueName?: string;
  isDisplayRefresh?: boolean;
  limitValue?: string;
  onChangeInput?: any;
  index?: number;
  totalTradingTitleName?: string;
  totalTradingActualPriceValue?: string;
  totalTradingApproxPriceValue?: string;
  liquidityPools?: PoolData[];
  userPortfolio?: tokenData[];
  limitSwap?: 'sell' | 'buy' | undefined | false;
}
