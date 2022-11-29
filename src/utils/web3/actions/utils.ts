import { BigNumber as BigNum } from '@ethersproject/bignumber';
import { CHAIN_ID } from 'constants/index';
import { NETWORK } from 'constants/networks';

export interface TransactionResponseProps {
  tx: any;
  uniqueMessage?: { text: string; secondText?: string };
  operation?:
    | 'APPROVE'
    | 'LIQUIDITY'
    | 'BRIDGE'
    | 'FARM'
    | 'SWAP'
    | 'BRIBE'
    | undefined;
  inputSymbol?: string;
  inputValue?: string;
  outputSymbol?: string;
  outputValue?: string;
  chainID?: number;
  link?: string;
  update?: string;
  updateTarget?: string;
}

export const calculateGasMargin = (value: BigNum) => {
  return value
    .mul(BigNum.from(10000).add(BigNum.from(1000)))
    .div(BigNum.from(10000));
};

export const transactionResponse = (
  title: string,
  detailTx: TransactionResponseProps,
) => {
  const {
    tx,
    uniqueMessage,
    operation,
    inputSymbol,
    inputValue,
    outputSymbol,
    outputValue,
    chainID = CHAIN_ID,
    update,
    updateTarget,
  } = detailTx;

  const explorerLink = NETWORK[chainID]?.blockExp;

  return {
    title,
    tx,
    uniqueMessage,
    operation,
    inputSymbol,
    inputValue,
    outputSymbol,
    outputValue,
    link: `${explorerLink}tx/${tx?.hash}`,
    update,
    updateTarget,
  };
};

export function calculateSlippageAmount(value: BigNum, slippage: number = 10) {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`);
  }

  return [
    value
      .mul(10000 - slippage)
      .div(10000)
      .toString(),
    value
      .mul(10000 + slippage)
      .div(10000)
      .toString(),
  ];
}
