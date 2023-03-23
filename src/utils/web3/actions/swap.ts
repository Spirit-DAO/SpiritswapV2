import { getProvider } from 'app/connectors/EthersConnector/login';
import { Token } from 'app/interfaces/General';
import { formatAmount } from 'app/utils';
import { TOKENS_WITH_HIGH_SLIPPAGE } from 'constants/index';
import { JEFE, WFTM } from 'constants/tokens';
import { BigNumber } from 'ethers';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { SLIPPAGE_TOLERANCES, SwapQuote } from 'utils/swap';
import { placeLimitOrder } from 'utils/swap/gelato';
import { buildSwapForParaSwap } from 'utils/swap/paraswap';
import { GeletoLimitParams } from 'utils/swap/types';
import { connect } from '../connection';
import { Contract } from '../contracts';
import { transactionResponse } from './utils';

export const swapTransaction = async (
  senderAddress,
  quote: SwapQuote,
  firstToken?: Token, // Not filtering directly from whitelist for when using non-verified tokens
  secondToken?: Token,
  gasPriceData?: {
    gasPrice: string;
    txGweiCost: string;
    type: string;
  },
  deadlineOffset?: number,
) => {
  const _connection = getProvider();
  const { signer } = await connect(_connection);
  const MIN_GAS_LIMIT = BigNumber.from('300000');

  if (quote.priceRoute) {
    const { priceRoute } = quote;

    const srcTokenAddress = quote.buyTokenAddress.toLowerCase();
    const destTokenAddress = quote.sellTokenAddress.toLowerCase();

    let finalSlippage;

    finalSlippage = TOKENS_WITH_HIGH_SLIPPAGE.includes(
      srcTokenAddress || destTokenAddress,
    )
      ? +SLIPPAGE_TOLERANCES[2] * 100 // 1%
      : quote.slippage || +SLIPPAGE_TOLERANCES[1] * 100; // Slippage by user or 0.5% by default

    if (
      srcTokenAddress === JEFE.address.toLowerCase() ||
      destTokenAddress === JEFE.address.toLowerCase()
    ) {
      finalSlippage = '3000'; // for JEFE token we set the slippage to 30%
    }

    const transactionRequest = await buildSwapForParaSwap({
      side: priceRoute.side,
      srcToken: priceRoute.srcToken,
      destToken: priceRoute.destToken,
      srcDecimals: priceRoute?.srcDecimals,
      destDecimals: priceRoute?.destDecimals,
      srcAmount: priceRoute.srcAmount,
      destAmount: priceRoute.destAmount,
      priceRoute: priceRoute,
      slippage: finalSlippage,
      userAddress: senderAddress,
      deadlineOffset,
    });

    quote.data = transactionRequest.data;
    quote.gas = transactionRequest.gas;
    quote.gasPrice = transactionRequest.gasPrice;
    quote.to = transactionRequest.to;
    quote.value = transactionRequest.value;
  }

  const txGas = BigNumber.from(quote.gas);

  // These are the amounts that make the unidex api work every time
  // TODO: Sort out a more dynamic way to set these ones

  const tx = {
    from: senderAddress,
    gasLimit: MIN_GAS_LIMIT.gt(txGas) ? MIN_GAS_LIMIT : txGas,
    to: quote.to,
    value: BigNumber.from(quote.value),
    data: quote.data,
    chainId: quote.chainId,
  };

  if (gasPriceData?.type !== 'standard') {
    tx['gasPrice'] = BigNumber.from(gasPriceData?.gasPrice ?? quote.gasPrice);
  }

  const transaction = await signer.sendTransaction(tx);

  return transactionResponse('swap.process', {
    operation: 'SWAP',
    tx: transaction,
    inputSymbol: firstToken ? firstToken.symbol : '',
    inputValue: firstToken
      ? formatAmount(quote.sellAmount, firstToken.decimals)
      : '',
    outputSymbol: secondToken ? secondToken.symbol : '',
    outputValue: secondToken
      ? formatAmount(quote.buyAmount, secondToken.decimals)
      : '',
    update: 'portfolio',
    updateTarget: 'user',
  });
};

export const placeOrderLimit = async (
  _userAddress,
  _trade: GeletoLimitParams,
  _handler = undefined,
  _chainId = undefined,
) => {
  const _connection = getProvider();
  const { signer } = await connect(_connection);

  const inputAmount = parseUnits(_trade.inputAmount, _trade.inputDecimals);
  const outputAmount = parseUnits(_trade.minReturn, _trade.outputDecimals);

  return placeLimitOrder(
    _userAddress,
    signer,
    _trade.inputToken,
    _trade.outputToken,
    inputAmount,
    outputAmount,
    parseUnits(_trade.inputAmount, _trade.inputDecimals).toString(),
  );
};

export const wrappedFTMaction = async (
  isDeposit: boolean,
  value: string,
  addToQueue,
) => {
  try {
    const _connection = getProvider();
    const { signer } = await connect(_connection);
    const contract = await Contract(
      WFTM.address,
      'wrappedFTM',
      'rpc',
      250,
      signer,
      true,
    );
    const parseValue = parseEther(value).toHexString();

    if (isDeposit) {
      const deposit = await contract.deposit({
        value: parseValue,
      });

      const tx = transactionResponse('swap.wrap', {
        operation: 'SWAP',
        tx: deposit,
        inputSymbol: 'FTM',
        inputValue: value,
        outputSymbol: 'WFTM',
        outputValue: value,
        update: 'portfolio',
        updateTarget: 'user',
      });
      addToQueue(tx);
      return deposit;
    }

    const withdraw = await contract.withdraw(parseValue);

    const tx = transactionResponse('swap.unwrap', {
      operation: 'SWAP',
      tx: withdraw,
      inputSymbol: 'WFTM',
      inputValue: value,
      outputSymbol: 'FTM',
      outputValue: value,
      update: 'portfolio',
      updateTarget: 'user',
    });
    addToQueue(tx);

    return withdraw;
  } catch (error) {
    throw '';
  }
};
