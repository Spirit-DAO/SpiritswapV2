import { checkAddress } from 'app/utils';
import { useMemo } from 'react';
import { useTokens } from './useTokens';

export const useToken = (
  chainId: number,
  tokenAddress: string,
  isBridge: boolean = false,
) => {
  const { tokens, isLoading, isFetching } = useTokens(chainId, isBridge);

  const token = useMemo(() => {
    const token = tokens?.find(
      token =>
        checkAddress(token.address, tokenAddress) && token.chainId === chainId,
    );
    return token;
  }, [chainId, tokenAddress, tokens]);

  return {
    token,
    isLoading: isLoading && isFetching,
    tokens,
  };
};
