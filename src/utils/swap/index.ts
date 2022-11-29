// In order to submit ERC20 token order to the aggregator you need to give allowance to the erc20proxy
// contract. This is only needed when spending asset is a ERC20 token where as native gastoken like FTM on th Fantom newor
import { CHAIN_ID } from 'constants/index';
import {
  QuoteParams,
  OrderLimitParams,
  OpenOrderLimit,
  SwapQuote,
  UserInput,
  TradeArrayItem,
  QuoteOrderData,
  CancelOrderLimitParams,
  TransactionData,
} from './types';

// Endpoint where we are making the requests to unidex
export const UNIDEX_API_ENDPOINT = 'https://unidexmirai.org';
export const UNIDEX_ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const ALLOWANCE_HANDLER_ADDRESS =
  '0xdef189deaef76e379df891899eb5a00a94cbc250';

export const SLIPPAGE_TOLERANCES = ['0.1', '0.5', '1', 'Auto'];

export const SLIPPAGE_ID = {
  '0.1': 0,
  '0.5': 1,
  '1': 2,
  Auto: 3,
};
export const SPEED_PRICES = {
  STANDARD: 'Standard',
  FAST: 'Fast',
  INSTANT: 'Instant',
};
export const SPEED_VALUES = ['Standard', '164', '236'];
export const DEFAULT_DEADLINE = 20;

export enum GAS_PRICE {
  fast = 1.2,
  instant = 1.4,
}

const formatQuery = params => {
  let searchParams: string = '';

  Object.keys(params).forEach((param, index) => {
    searchParams += `${index > 0 ? '&' : '?'}${param}=${params[param]}`;
  });

  return searchParams;
};

export const unidex = async (
  _endpoint: string,
  optionalSignal?: AbortSignal,
  _method = 'GET',
) => {
  try {
    const requestUrl = `${UNIDEX_API_ENDPOINT}${_endpoint}`;

    const controller = new AbortController();
    const { signal } = controller;
    let response;
    try {
      response = await fetch(requestUrl, {
        signal: optionalSignal ? optionalSignal : signal,
      });
    } catch (error) {
      response = {};
    }

    if (response.ok) {
      return response.json();
    }
  } catch (e) {
    console.error('Error fetching', e);
  }
};

export const quoteRate = async (_params: QuoteParams, signal?: AbortSignal) => {
  const fetchParams = _params;

  if (!fetchParams.includedSources) {
    fetchParams.includedSources = 'SpiritSwap';
  }

  if (!fetchParams.slippagePercentage) {
    fetchParams.slippagePercentage = 0.01; // Default is 1% slippage
  }

  if (fetchParams.buyToken === '0' || fetchParams.sellToken === '0') {
    return null;
  }

  const call = `/swap/v1/quote${formatQuery(fetchParams)}`;
  const unidexResponse = await unidex(call, signal);

  if (!unidexResponse || !unidexResponse?.orders) {
    return null;
  }

  const response: SwapQuote = unidexResponse;
  return response;
};

// Creates a data representing a LIMIT ORDER.
// Transaction should be submitted to the blockchain to be created
export const createLimitOrderTx = async (_params: OrderLimitParams) => {
  const fetchParams = _params;

  if (!fetchParams.sellToken) {
    fetchParams.sellToken = UNIDEX_ETH_ADDRESS;
  }

  if (!fetchParams.buyToken) {
    fetchParams.buyToken = UNIDEX_ETH_ADDRESS;
  }

  fetchParams.chainId = CHAIN_ID;

  const call = `/orders/limit${formatQuery(fetchParams)}`;

  const response: SwapQuote = await unidex(call);
  return response;
};

// Lists Open Limit Orders
export const listLimitOrders = async (
  _walletAddress: string,
  _chainId = CHAIN_ID,
) => {
  const fetchParams = {
    chainId: _chainId,
    account: _walletAddress,
  };

  const call = `/orders/limit/list${formatQuery(fetchParams)}`;

  const response: OpenOrderLimit[] = await unidex(call);

  return response;
};

// Returns representation of transaction data meant to cancel and order limit
export const cancelLimitOrderTx = async (_params: CancelOrderLimitParams) => {
  const fetchParams = _params;

  if (!fetchParams.chainId) {
    fetchParams.chainId = CHAIN_ID;
  }

  const call = `/orders/limit/cancel${formatQuery(fetchParams)}`;

  const response: TransactionData = await unidex(call);

  return response;
};

export type {
  QuoteParams,
  SwapQuote,
  UserInput,
  TradeArrayItem,
  QuoteOrderData,
  OrderLimitParams,
};
