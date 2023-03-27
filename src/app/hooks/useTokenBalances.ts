import { TokenAmount } from '@lifi/sdk';
import { checkAddress } from 'app/utils';
import { LiFi } from 'config/lifi';
import { formatUnits } from 'ethers/lib/utils';
import { useQuery } from 'react-query';
import { getUserBalances } from 'utils/data';
import { useChains } from './useChains';
import { useTokens } from './useTokens';
import useWallets from './useWallets';

const TIME = 60_00;

export const useTokenBalances = (selectedChainId: number = 42161) => {
  const { account } = useWallets();
  const { chains, isLoading: isChainsLoading } = useChains();
  const { tokens, isLoading, isFetching } = useTokens(selectedChainId, true);

  const isBalancesLoadingEnabled =
    Boolean(account) && Boolean(tokens) && Boolean(chains);

  const {
    data: tokensWithBalance,
    isLoading: isBalancesLoading,
    isFetching: isBalancesFetching,
    refetch,
  } = useQuery(
    ['token-balances', selectedChainId, account],
    async ({ queryKey: [_, __, account] }) => {
      if (!account || !tokens) {
        return [];
      }
      const fallbackBalance: TokenAmount[] = [];

      const tokenBalances = await LiFi.getTokenBalances(
        account as string,
        tokens,
      );

      if (tokenBalances.length === 0) {
        const covalentTokensData = await getUserBalances(
          account,
          selectedChainId,
        );

        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i];
          const covalentToken = covalentTokensData.items.find(covaToken =>
            checkAddress(covaToken.contract_address, token.address),
          );
          if (covalentToken) {
            const amount: string = formatUnits(
              covalentToken.balance,
              covalentToken.contract_decimals,
            );
            fallbackBalance.push({ ...token, amount });
          } else {
            fallbackBalance.push({ ...token, amount: '0' });
          }
        }
      }

      const formatedTokens =
        tokenBalances.length === 0 ? fallbackBalance : tokenBalances;
      return [
        ...formatedTokens
          .filter(token => token.amount !== '0')
          .sort(
            (a, b) =>
              parseFloat(b.amount ?? '0') * parseFloat(b.priceUSD ?? '0') -
              parseFloat(a.amount ?? '0') * parseFloat(a.priceUSD ?? '0'),
          ),
        ...formatedTokens.filter(token => token.amount === '0'),
      ];
    },
    {
      enabled: isBalancesLoadingEnabled,
      refetchIntervalInBackground: true,
      refetchInterval: TIME,
      cacheTime: TIME,
      staleTime: TIME,
    },
  );

  return {
    tokens: tokensWithBalance ?? (tokens as TokenAmount[]),
    isLoading:
      (isBalancesLoading && isBalancesLoadingEnabled) ||
      (isLoading && isFetching) ||
      isChainsLoading,
    isFetching: isBalancesFetching,
    updateBalances: refetch,
  };
};
