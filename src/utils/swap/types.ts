// Types related to unidex and swap page

import { Token } from 'app/interfaces/General';
import { OptimalRate } from 'paraswap-core';

export interface QuoteParams {
  buyToken: string;
  sellToken: string;
  buyAmount?: string;
  sellAmount?: string;
  slippagePercentage?: number;
  includedSources?: string;
  gasPrice?: string;
}

export interface OrderLimitParams {
  chainId?: number;
  account: string;
  sellToken: string;
  sellAmount?: number;
  buyToken: string;
  buyAmount?: number;
}

export interface QuoteOrderData {
  fillData: {
    router?: string;
    tokenAddressPath: string[];
  };
  makerAmount?: string;
  makerToken?: string;
  sourcePathId?: string;
  takerAmount?: string;
  takerToken?: string;
}

export interface SwapQuote {
  chainId: number;
  price: string;
  fromToken: string;
  toToken: string;
  buyAmount: string;
  sellAmount: string;
  allowanceTarget: string;
  estimatedPriceImpact: string;
  orders: QuoteOrderData[];
  sellTokenAddress: string;
  buyTokenAddress: string;
  //
  to?: string;
  gas?: string;
  gasPrice?: string;
  value?: string; // amount of FTM that should be sent with transaction;
  data?: string; // Call data required to be sent to the 'to' contract address
  slippage?: number;
  priceRoute?: OptimalRate;
}

export interface TransactionData {
  tx: {
    to: string;
    data: string;
    from: string;
  };
}

export interface OpenOrderLimit {
  createdAt: string;
  id: string;
  inputAmount: string;
  inputToken: string;
  minReturn: string;
  module: string;
  outputToken: string;
  owner: string;
  secret: string;
  status: string;
  witness: string;
}

export interface CancelOrderLimitParams {
  account: string;
  chainId?: number;
  module: string;
  inputToken: string;
  outputToken: string;
  minReturn: string;
  owner: string;
  witness: string;
}

export interface UserInput {
  value: number;
  token: string;
}

export interface TradeArrayItem {
  title: string;
  balancePrice: string;
  ratePrice: string;
  tradingTokenSymbol: string;
  tradingActualPrice: string;
  tradingApproxPrice: string;
  tradingDecimals?: number;
  address: string;
  tradingLogo: string;
}

export interface AlgebraLimitOrder {
  [key: string]: any;
}
