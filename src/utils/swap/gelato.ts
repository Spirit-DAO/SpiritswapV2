// Module for handling limit order using gelato
import {
  GelatoLimitOrders,
  GelatoStopLimitOrders,
  ChainId,
  Handler,
  StopLimitOrder,
} from '@gelatonetwork/limit-orders-lib';
import { BigNumber } from 'ethers';
import { BASE_TOKEN_ADDRESS, CHAIN_ID, DEFAULT_HANDLER } from 'constants/index';
import { transactionResponse, wallet } from 'utils/web3';
import { findToken } from 'utils/web3/utils';
import { GelattoLimitOrder } from './types';
import tokens, { FTM } from 'constants/tokens';
import { checkAddress, formatAmount } from 'app/utils';
import { getProvider } from 'app/connectors/EthersConnector/login';

export const GELATO_NATIVE_ASSET_ADDRESS =
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const limitOrdersItf = (
  _signer,
  _handler: Handler = DEFAULT_HANDLER,
  _chainId: ChainId = CHAIN_ID,
) => new GelatoLimitOrders(_chainId, _signer, _handler);

export const stopLimitOrdersItf = (
  _signer,
  _handler: Handler = DEFAULT_HANDLER,
  _chainId: ChainId = CHAIN_ID,
) => new GelatoStopLimitOrders(_chainId, _signer, _handler);

// inputAmount = Amount to sell
// _minReturn = Minimum amount of outToken which the users want to receive back
// _userAddress = Address of user who places the order, must be the same as the signer ddress
export const placeLimitOrder = async (
  _userAddress: string,
  _signer: any,
  _inputToken: string,
  _outputToken: string,
  _inputAmount: BigNumber,
  _minReturn: BigNumber,
  _allowance: string,
  _handler: Handler = DEFAULT_HANDLER,
  _chainId: ChainId = CHAIN_ID,
) => {
  const itf = limitOrdersItf(_signer, _handler, _chainId);

  const tx = await itf.submitLimitOrder(
    _inputToken,
    _outputToken,
    _inputAmount,
    _minReturn,
  );

  const isFTMToken =
    (_inputToken || _outputToken) === GELATO_NATIVE_ASSET_ADDRESS;

  const [tokenA] = tokens.filter(
    token =>
      `${token.address}`.toLowerCase() ===
      `${isFTMToken ? FTM.address : _inputToken}`.toLowerCase(),
  );
  const [tokenB] = tokens.filter(token => {
    if (checkAddress(token.address, BASE_TOKEN_ADDRESS)) {
      if (checkAddress(_outputToken, GELATO_NATIVE_ASSET_ADDRESS)) return token;
    }
    return checkAddress(token.address, _outputToken);
  });

  return transactionResponse('limitOrder.place', {
    tx: tx,
    operation: 'SWAP',
    inputSymbol: tokenA.symbol,
    outputSymbol: tokenB.symbol,
    inputValue: formatAmount(_inputAmount.toString(), tokenA.decimals),
    outputValue: formatAmount(_minReturn.toString(), tokenB.decimals),
    update: 'limits',
    updateTarget: 'user',
  });
};

// _maxReturn = Maximum amount of outToken which the users wants to receive back - stop limit price
export const placeStopLimitOrder = async (
  _userAddress: string,
  _signer: any,
  _inputToken: string,
  _outputToken: string,
  _inputAmount: number,
  _maxReturn: number,
  _handler: Handler = DEFAULT_HANDLER,
  _chainId: ChainId = CHAIN_ID,
) => {
  const itf = stopLimitOrdersItf(_signer, _handler, _chainId);

  const tx = await itf.submitStopLimitOrder(
    _inputToken,
    _outputToken,
    _inputAmount,
    _maxReturn,
  );

  return transactionResponse('stopLimitOrder', {
    tx: tx,
    operation: 'SWAP',
    update: 'limits',
    updateTarget: 'user',
  });
};

export const cancelLimitOrder = async (
  _order: GelattoLimitOrder,
  _chainId: ChainId = CHAIN_ID,
  _handler: Handler = DEFAULT_HANDLER,
) => {
  const connector = getProvider();
  const { signer } = await wallet(connector);
  const itf = limitOrdersItf(signer, _handler, _chainId);
  const order = _order;

  const tx = await itf.cancelLimitOrder(order, true);

  const inputValue = formatAmount(
    _order.inputAmount,
    Number(_order.inputTokenData?.decimals),
  );

  const outputValue = formatAmount(
    _order.adjustedMinReturn,
    Number(_order.outputTokenData?.decimals),
  );
  return transactionResponse('limitOrder.cancel', {
    tx: tx,
    operation: 'SWAP',
    inputSymbol: _order.inputTokenData?.symbol,
    outputSymbol: _order.outputTokenData?.symbol,
    inputValue: inputValue,
    outputValue: outputValue,
    update: 'limits',
    updateTarget: 'user',
  });
};

export const cancelStopLimitOrder = async (
  _signer: any,
  _order: StopLimitOrder,
  _type?: string,
  _chainId: ChainId = CHAIN_ID,
  _handler: Handler = DEFAULT_HANDLER,
) => {
  const itf = stopLimitOrdersItf(_signer, _handler, _chainId);
  const tx = await itf.cancelStopLimitOrder(_order, true);

  return transactionResponse('cancelStopLimitOrder', {
    tx: tx,
    operation: 'LIQUIDITY',
    update: 'limits',
    updateTarget: 'user',
  });
};

export const getLimitOrders = async (
  _userAddress: string,
  _handler: Handler = DEFAULT_HANDLER,
  _chainId: ChainId = CHAIN_ID,
  _signer: any = null,
) => {
  let signer;

  if (_signer) {
    signer = _signer;
  } else {
    const connector = getProvider();
    ({ signer } = await wallet(connector));
  }

  const itf = limitOrdersItf(signer, _handler, _chainId);
  const orders: GelattoLimitOrder[] = await itf.getOrders(_userAddress);
  const ftmToken = findToken('FTM', 'symbol');

  // Before we return token, we attach specific token data;
  orders.forEach(order => {
    const { inputToken, outputToken } = order;
    const inputIsFTM =
      inputToken.toLowerCase() === GELATO_NATIVE_ASSET_ADDRESS.toLowerCase();
    const outputIsFTM =
      outputToken.toLowerCase() === GELATO_NATIVE_ASSET_ADDRESS.toLowerCase();

    order.inputTokenData = inputIsFTM ? ftmToken : findToken(inputToken);
    order.outputTokenData = outputIsFTM ? ftmToken : findToken(outputToken);
  });

  return orders;
};
