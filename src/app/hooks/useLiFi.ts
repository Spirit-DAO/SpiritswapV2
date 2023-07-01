import { useCallback, useState } from 'react';
import { parseUnits } from 'ethers/lib/utils';
import { constants, PopulatedTransaction, BigNumber } from 'ethers';
import { StatusResponse, Step } from '@lifi/sdk';
import { Contract } from 'utils/web3/contracts';
import { useQuery, useQueryClient } from 'react-query';
import { LiFi } from 'config/lifi';
import { getProvider } from 'app/connectors/EthersConnector/login';
import { BRIDGES_ALLOWED, BRIDGE_MODE } from 'constants/index';
import {
  NON_ROUTE,
  NOT_ENOUGH_AMOUNT,
  NOT_ENOUGH_AMOUNT_ETH,
} from 'constants/errors';
import UseIsLoading from './UseIsLoading';

interface Props {
  toTokenAddress?: string;
  fromChainId: number;
  fromTokenAddress?: string;
  fromUserAddress: string;
  toChainId: number;
  tokenAmount: string;
  bridgeMode: string;
  decimals?: number;
  toUserAddress?: string;
  slippage?: number;
  handleError: (error: any) => void;
  tokenUSDAmount: number;
}

export const useLiFi = ({
  fromChainId,
  fromTokenAddress,
  fromUserAddress,
  toChainId,
  tokenAmount,
  decimals,
  toTokenAddress,
  toUserAddress,
  slippage,
  bridgeMode,
  handleError,
  tokenUSDAmount,
}: Props) => {
  const [allowance, setAllowance] = useState<PopulatedTransaction>();
  const { isLoading, loadingOff, loadingOn } = UseIsLoading();
  const [fallback, setFallback] = useState(true);
  const queryClient = useQueryClient();
  const { data } = useQuery(
    [
      'quote',
      fromChainId,
      fromTokenAddress,
      fromUserAddress,
      tokenAmount,
      toChainId,
      toTokenAddress,
      toUserAddress,
      slippage,
    ],
    async ({
      queryKey: [
        _,
        fromChainId,
        fromTokenAddress,
        fromUserAddress,
        tokenAmount,
        toChainId,
        toTokenAddress,
        toUserAddress,
        slippage,
      ],
      signal,
    }: any) => {
      loadingOn();

      await queryClient.cancelQueries('quote');

      const fromAmount = parseUnits(tokenAmount, decimals).toString();
      handleError('');
      const params = (bridgeMode: string) => ({
        fromChain: fromChainId,
        fromToken: fromTokenAddress,
        fromAddress: fromUserAddress,
        fromAmount,
        slippage: slippage / 100,
        toChain: toChainId,
        toToken: toTokenAddress,
        toAddress: toUserAddress,
        integrator: 'SpiritSwap',
        allowBridges:
          bridgeMode === BRIDGE_MODE.cheap
            ? [...BRIDGES_ALLOWED]
            : BRIDGES_ALLOWED,
      });
      try {
        if (toChainId === 1 && tokenUSDAmount < 100) {
          loadingOff();
          handleError(NOT_ENOUGH_AMOUNT_ETH);
        } else if (tokenUSDAmount <= 10 && tokenUSDAmount !== 0) {
          loadingOff();
          handleError(NOT_ENOUGH_AMOUNT);
        } else {
          const step = await LiFi.getQuote(params(bridgeMode), { signal });
          if (step.transactionRequest) {
            await checkAndSetAllowance(step);
          }
          loadingOff();
          return step;
        }
      } catch (error) {
        if (fallback) {
          setFallback(false);
          const step = await LiFi.getQuote(params(BRIDGE_MODE.cheap), {
            signal,
          });
          if (step.transactionRequest) {
            await checkAndSetAllowance(step);
          }
          loadingOff();
          return step;
        }
        if (tokenUSDAmount >= 10) {
          handleError(NON_ROUTE);
        }
      }
    },
    {
      enabled: Boolean(
        fromChainId &&
          fromTokenAddress &&
          fromUserAddress &&
          tokenAmount &&
          toChainId &&
          toTokenAddress,
      ),
      refetchIntervalInBackground: true,
      refetchInterval: 30_000,
      staleTime: 30_000,
      // TODO: probably should be removed
      cacheTime: 30_000,
    },
  );

  const checkAndSetAllowance = useCallback(
    async (step: Step) => {
      // Transactions with the native token don't need approval
      if (step.action.fromToken.address === constants.AddressZero) {
        setAllowance(undefined);
        return;
      }
      try {
        const _connector = await getProvider();
        const erc20 = await Contract(
          step.action.fromToken.address,
          'erc20',
          _connector,
          fromChainId,
        );
        const allowance = await erc20.allowance(
          fromUserAddress,
          step.estimate.approvalAddress,
        );
        if (allowance.lt(step.action.fromAmount)) {
          const allowance = await erc20.populateTransaction.approve(
            step.estimate.approvalAddress,
            step.action.fromAmount,
          );
          setAllowance({
            ...allowance,
            gasPrice: BigNumber.from(step.transactionRequest?.gasPrice),
            gasLimit: BigNumber.from('200000'),
          });
        } else {
          setAllowance(undefined);
        }
      } catch (error) {
        setAllowance(undefined);
      }
    },
    [fromChainId, fromUserAddress],
  );

  const waitForReceivingChain = useCallback(
    async (txHash: string) => {
      if (fromChainId !== toChainId) {
        let result: StatusResponse;
        do {
          result = await LiFi.getStatus({
            fromChain: fromChainId,
            toChain: toChainId,
            txHash,
            bridge: data?.tool,
          });
          await new Promise(r => setTimeout(r, 2000));
        } while (result.status !== 'DONE' && result.status !== 'FAILED');
        return result;
      }
    },
    [data?.tool, fromChainId, toChainId],
  );
  return {
    quote: data,
    allowance,
    loading: isLoading,
    waitForReceivingChain,
  };
};
