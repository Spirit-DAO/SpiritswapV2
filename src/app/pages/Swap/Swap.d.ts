import { SwapQuote } from 'utils/swap';

import { Token } from '../../interfaces/General';

type valueInput = { value: string } | string;

export type SwapProps = {
  isLimitBuy?: boolean;
  showInputInUSD?: boolean;
  setShowInputInUSD?: (value: boolean) => void;
  firstToken: {
    value: string;
    limitbuy?: string;
    receive?: string;
    limitsell?: string;
    tokenSelected: Token;
  };

  secondToken: {
    value: string;
    receive?: string;
    limitbuy?: string;
    limitsell?: string;
    tokenSelected: Token;
  };

  trade: SwapQuote | undefined;
  handleChangeToken: (
    tokenSelected: Token,
    onClose: () => void,
    type: number,
  ) => void;
  setSwapConfirm: (value: boolean) => void;
  slippage: string;
  isLimit?: boolean;
  isLoading: boolean;
  modeIndex?: number;
  approveMax?: boolean;
  handleChangeInput: (
    valueInput,
    type: number,
    txType?:
      | 'swap'
      | 'limitsell'
      | 'limitbuy'
      | 'receive'
      | 'limit'
      | undefined,
    tokenFrom?: SwapState,
    tokenTo?: SwapState,
    keepSecondAmount?: boolean,
    changedTokenFrom?: number,
  ) => void;
  swapAmountPanel: () => void;
  toggleSettings: () => void;
  apiCallError?: string;
};

export type SwapState = {
  value: string;
  receive?: string;
  limitbuy?: string;
  limitsell?: string;
  tokenSelected: Token;
};

export type SwapConfirmProps = {
  firstToken: {
    value: string;
    tokenSelected: Token;
  };
  showInputInUSD?: boolean;

  secondToken: {
    value: string;
    tokenSelected: Token;
  };
  isWrapped: boolean;
  isLimit?: boolean;
  trade: SwapQuote;
  setSwapConfirm: (value: boolean) => void;
  resetInput: () => void;
};
