import { getProvider } from 'app/connectors/EthersConnector/login';
import { Token } from 'app/interfaces/General';
import { formatAmount } from 'app/utils';
import contracts from 'constants/contracts';
import { CHAIN_ID, TOKENS_WITH_HIGH_SLIPPAGE } from 'constants/index';
import { WFTM } from 'constants/tokens';
import { BigNumber } from 'ethers';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { SLIPPAGE_TOLERANCES, SwapQuote } from 'utils/swap';
import { buildSwapForParaSwap } from 'utils/swap/paraswap';
import { connect } from '../connection';
import { Contract } from '../contracts';
import { transactionResponse } from './utils';
import { Token as TokenV3, toHex } from '../../../v3-sdk';

export const algebraLimitOrderManagerContract = async () => {
  const _connector = getProvider();
  let contract = 'v3LimitOrderManager';

  const limitOrderManagerContract = await Contract(
    contracts[contract][CHAIN_ID],
    contract,
    _connector,
    CHAIN_ID,
  );

  return limitOrderManagerContract;
};

export const swapTransaction = async (
  senderAddress,
  quote: SwapQuote,
  firstToken?: Token, // Not filtering directly from whitelist for when using non-verified tokens
  secondToken?: Token,
  gasPrice?: string,
  deadlineOffset?: number,
) => {
  const _connection = getProvider();
  const { signer } = await connect(_connection);
  const MIN_GAS_LIMIT = BigNumber.from('300000');

  if (quote.priceRoute) {
    const { priceRoute } = quote;

    const finalSlippage = TOKENS_WITH_HIGH_SLIPPAGE.includes(
      quote.buyTokenAddress.toLowerCase() ||
        quote.sellTokenAddress.toLowerCase(),
    )
      ? +SLIPPAGE_TOLERANCES[2] * 100 // 1%
      : quote.slippage || +SLIPPAGE_TOLERANCES[1] * 100; // Slippage by user or 0.5% by default

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
    gasPrice: BigNumber.from(gasPrice ?? quote.gasPrice),
    gasLimit: MIN_GAS_LIMIT.gt(txGas) ? MIN_GAS_LIMIT : txGas,
    to: quote.to,
    value: BigNumber.from(quote.value),
    data: quote.data,
    chainId: quote.chainId,
  };

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

export const placeAlgebraLimitOrdrer = async (
  token0: TokenV3,
  token1: TokenV3,
  amount,
  tick,
  isNative,
  currentTick,
) => {
  const limitOrderManagerContract = await algebraLimitOrderManagerContract();

  const sorted = token0?.sortsBefore(token1);

  const [_token0, _token1] = sorted ? [token0, token1] : [token1, token0];

  const value = isNative
    ? toHex(parseUnits(amount.toString(), 18).toString())
    : 0;

  console.log(
    _token0.address,
    _token1.address,
    !sorted,
    parseUnits(amount.toString(), token0.decimals).toString(),
    tick,
    currentTick,
    value,
  );
  const tx = await limitOrderManagerContract.addLimitOrder(
    {
      token0: _token0.address,
      token1: _token1.address,
      depositedToken: !sorted,
      amount: parseUnits(amount.toString(), token0.decimals).toString(),
      tick,
    },
    { value },
  );

  return tx;
};

export const collectAlgebraLimitOrder = async (tokenId, amount, account) => {
  const limitOrderManagerContract = await algebraLimitOrderManagerContract();

  const decrease = limitOrderManagerContract.interface.encodeFunctionData(
    'decreaseLimitOrder',
    [tokenId, amount],
  );
  const collect = limitOrderManagerContract.interface.encodeFunctionData(
    'collectLimitOrder',
    [tokenId, account],
  );

  const callDatas = [decrease, collect];

  const tx = await limitOrderManagerContract.multicall(callDatas);

  return tx;
};
