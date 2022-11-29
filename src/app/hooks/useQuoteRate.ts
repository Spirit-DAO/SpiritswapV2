import { CHAIN_ID, FTM_TOKEN_NULL_ADDRESS } from 'constants/index';
import { useEffect, useState } from 'react';
import { QuoteParams, SLIPPAGE_TOLERANCES, SwapQuote } from 'utils/swap';
import { getParaSwapRate } from 'utils/swap/paraswap';
import { useToken } from './useToken';
import useWallets from 'app/hooks/useWallets';

const paraSwapErrors = {
  ESTIMATED_LOSS_GREATER_THAN_MAX_IMPACT: 'price impact too high',
};

const useQuoteRate = (params: QuoteParams) => {
  const [tx, setTx] = useState<SwapQuote | undefined>();
  const [txError, setTxError] = useState<string | undefined>(undefined);
  const controller = new AbortController();
  const { signal } = controller;
  const { account } = useWallets();

  const { token: tokenA } = useToken(CHAIN_ID, params.sellToken);
  const { token: tokenB } = useToken(CHAIN_ID, params.buyToken);

  const paraSwapParams = {
    srcToken:
      params.sellToken === FTM_TOKEN_NULL_ADDRESS.address
        ? FTM_TOKEN_NULL_ADDRESS
        : tokenA,
    destToken:
      params.buyToken === FTM_TOKEN_NULL_ADDRESS.address
        ? FTM_TOKEN_NULL_ADDRESS
        : tokenB,
    srcAmount: params.sellAmount || '0',
    destAmount: params.buyAmount || '0',
    userAddress: account,
    slippage: params.slippagePercentage || +SLIPPAGE_TOLERANCES[1],
  };

  useEffect(() => {
    const t = async () => {
      try {
        setTxError(undefined);
        const estimation = await getParaSwapRate(paraSwapParams, signal);

        setTx(estimation ? estimation : undefined);
      } catch (error: any) {
        const msg = paraSwapErrors[error.response?.data.error];
        const res: SwapQuote = {
          fromToken: '',
          toToken: '',
          allowanceTarget: '',
          buyAmount: '0',
          buyTokenAddress: '',
          chainId: CHAIN_ID,
          sellAmount: '',
          sellTokenAddress: '',
          orders: [],
          price: '0',
          estimatedPriceImpact: '0',
        };

        setTxError(msg);
        setTx(res);
      }
    };
    t();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  return { quoteRateEstimation: tx, txError };
};

export default useQuoteRate;
