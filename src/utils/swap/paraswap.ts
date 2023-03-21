import { CHAIN_ID, FTM, FTM_TOKEN_NULL_ADDRESS } from 'constants/index';
import { Address, NumberAsString, OptimalRate, SwapSide } from 'paraswap-core';
import axios from 'axios';
import { SwapQuote } from './types';
import { Token } from 'app/interfaces/General';
import { formatUnits } from 'ethers/lib/utils';

interface PriceQueryParams {
  srcToken: string;
  destToken: string;
  srcDecimals: number;
  destDecimals: number;
  amount: string;
  side: SwapSide;
  network: string;
  includeDEXS: string;
  partner: string;
}

export interface Swapper {
  getRate(
    params: {
      srcToken: Token;
      destToken: Token;
      srcAmount: NumberAsString;
      destAmount: NumberAsString;
      slippage: number;
      userAddress: string;
    },
    signal: AbortSignal,
  );
  buildSwap(params: {
    side: string;
    srcToken: string;
    destToken: string;
    srcDecimals: number;
    destDecimals: number;
    srcAmount: NumberAsString;
    destAmount: NumberAsString;
    priceRoute: OptimalRate;
    slippage: number;
    userAddress: Address;
    deadlineOffset?: number;
  });
}

interface TransactionParams {
  to: Address;
  from: Address;
  value: NumberAsString;
  data: string;
  gasPrice: NumberAsString;
  gas?: NumberAsString;
  chainId: number;
}

interface BuildTxBody {
  srcToken: Address;
  destToken: Address;
  srcDecimals: number;
  destDecimals: number;
  srcAmount?: NumberAsString;
  destAmount?: NumberAsString;
  priceRoute: OptimalRate;
  slippage: number;
  userAddress: Address;
  receiver?: Address;
  deadline?: number;
}

const API_URL = 'https://apiv5.paraswap.io';

export const buildSwapForParaSwap: Swapper['buildSwap'] = async ({
  srcToken,
  destToken,
  srcDecimals,
  destDecimals,
  srcAmount,
  side,
  destAmount,
  slippage,
  priceRoute,
  userAddress,
  deadlineOffset,
}) => {
  const txURL = `${API_URL}/transactions/${CHAIN_ID}`;

  // We are given a minute based offset for the deadline
  // Make a new date object with the offset added to it
  const deadline = Math.floor(Date.now() / 1000) + (deadlineOffset ?? 0) * 60;

  const isSell = side === 'SELL';
  const isBuy = side === 'BUY';

  const txConfig: BuildTxBody = {
    priceRoute,
    srcToken,
    destToken,
    srcDecimals,
    destDecimals,
    destAmount: isBuy ? destAmount : undefined,
    srcAmount: isSell ? srcAmount : undefined,
    slippage,
    userAddress,
    deadline: deadline,
  };

  try {
    const { data } = await axios.post<TransactionParams>(txURL, txConfig);
    return data;
  } catch (err: any) {
    return;
  }
};

export const getParaSwapRate: Swapper['getRate'] = async (
  { srcToken, destToken, srcAmount, destAmount, slippage },
  signal,
) => {
  const isFirtsInput = srcAmount !== '0';
  const queryParams: PriceQueryParams = {
    srcToken: srcToken?.address,
    destToken: destToken?.address,
    srcDecimals: srcToken?.decimals,
    destDecimals: destToken?.decimals,
    amount: isFirtsInput ? srcAmount : destAmount,
    side: isFirtsInput ? SwapSide.SELL : SwapSide.BUY,
    network: CHAIN_ID.toString(),
    includeDEXS: 'SpiritSwap,SpiritSwapV2,SpiritSwapV3',
    partner: 'spiritswap',
  };

  const { amount } = queryParams;
  if (!srcToken?.address || !destToken?.address || amount === '0') {
    return undefined;
  }

  const searchString = new URLSearchParams(queryParams as any);

  const pricesURL = `${API_URL}/prices/?${searchString}`;

  const {
    data: { priceRoute },
  } = await axios.get<{ priceRoute: OptimalRate }>(pricesURL, {
    signal,
  });
  const getPrice = () => {
    const {
      srcAmount,
      srcUSD,
      destAmount,
      destUSD,
      srcDecimals,
      destDecimals,
    } = priceRoute;
    const srcAmountUSD = parseFloat(srcUSD);
    const destAmountUSD = parseFloat(destUSD);

    const formatSrcAmount = parseFloat(formatUnits(srcAmount, srcDecimals));
    const formatDestAmount = parseFloat(formatUnits(destAmount, destDecimals));

    const tokenA = srcAmountUSD / formatSrcAmount;
    const tokenB = destAmountUSD / formatDestAmount;

    return `${tokenA / tokenB}`;
  };

  const getRoutes = () => {
    const tokenAddressPath: string[] = [];
    const swaps = priceRoute.bestRoute[0].swaps;
    const isLastItem = swaps.length - 1;

    swaps.forEach((swap, i) => {
      const srcAddress =
        swap.srcToken === FTM_TOKEN_NULL_ADDRESS.address.toLowerCase()
          ? FTM.address
          : swap.srcToken;
      const destAddress =
        swap.destToken === FTM_TOKEN_NULL_ADDRESS.address.toLowerCase()
          ? FTM.address
          : swap.destToken;

      if (swaps.length === 1) {
        tokenAddressPath.push(srcAddress, destAddress);
      }

      if (swaps.length > 1) {
        if (i === 0) {
          tokenAddressPath.push(srcAddress);
        }
        if (i === isLastItem) {
          tokenAddressPath.push(destAddress);
          return;
        }
        tokenAddressPath.push(destAddress);
      }
    });
    const order = { fillData: { tokenAddressPath } };
    return [order];
  };

  const getPriceImpact = () => {
    const { srcUSD, destUSD } = priceRoute;
    const srcAmountUSD = parseFloat(srcUSD);
    const destAmountUSD = parseFloat(destUSD);

    return `${((destAmountUSD - srcAmountUSD) / srcAmountUSD) * 100}`;
  };

  const res: SwapQuote = {
    fromToken: priceRoute.srcToken,
    toToken: priceRoute.destToken,
    allowanceTarget: priceRoute.tokenTransferProxy,
    buyAmount: priceRoute.destAmount,
    buyTokenAddress: priceRoute.destToken,
    chainId: CHAIN_ID,
    sellAmount: priceRoute.srcAmount,
    sellTokenAddress: priceRoute.srcToken,
    orders: getRoutes(),
    price: getPrice(),
    estimatedPriceImpact: getPriceImpact(),
    priceRoute,
    slippage: slippage * 100,
  };

  return res;
};
