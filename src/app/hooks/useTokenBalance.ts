import { TokenAmount } from '@lifi/sdk';
import { checkAddress } from 'app/utils';
import { LiFi } from 'config/lifi';
import { BASE_TOKEN_ADDRESS, WFTM } from 'constants/index';
import { useQuery } from 'react-query';
import { selectLpPrices } from 'store/general/selectors';
import { useAppSelector } from 'store/hooks';
import {
  selectedWeightedLiquidityWallet,
  selectFarmsStaked,
  selectLiquidity,
  selectSobLiquidityWallet,
} from 'store/user/selectors';
import useGetTokensPrices from './useGetTokensPrices';
import { useToken } from './useToken';
import useWallets from './useWallets';

const TIME = 30000;
export const useTokenBalance = (
  chainId: number,
  tokenAddress: string,
  context: 'liquidity' | 'token' | 'farm' | 'sob' | 'weighted' | 'bridge',
  prefetchedToken: any = null,
) => {
  const { account } = useWallets();
  let { token: fetchedToken } = useToken(
    chainId,
    tokenAddress,
    context === 'bridge',
  );
  const farmsStaked = useAppSelector(selectFarmsStaked);
  const sobLiquidity = useAppSelector(selectSobLiquidityWallet);
  const weightedLiquidity = useAppSelector(selectedWeightedLiquidityWallet);
  const lpTokenPrices = useAppSelector(selectLpPrices);
  const { tokensPrices } = useGetTokensPrices({
    tokenAddresses: [
      tokenAddress === BASE_TOKEN_ADDRESS ? WFTM.address : tokenAddress,
    ],
    chainId,
  });

  const token = prefetchedToken || fetchedToken;

  const {
    data: tokenWithBalance,
    isLoading,
    isFetching,
  } = useQuery(
    ['token', tokenAddress, chainId, account],
    async ({ queryKey: [_, __, ___, address] }) => {
      if (!address) {
        return null;
      }

      let response;
      let liFiPromise;
      let rate;

      liFiPromise = token
        ? LiFi.getTokenBalance(address, token)
        : new Promise(() => {});

      switch (context) {
        case 'farm':
          const balanceInfoFarm = farmsStaked[tokenAddress];
          response = {
            ...balanceInfoFarm,
            rate: lpTokenPrices[tokenAddress.toLowerCase()],
          };
          break;
        case 'sob':
          response = sobLiquidity.find(token =>
            checkAddress(token.address, tokenAddress),
          );
          break;
        case 'weighted':
          response = weightedLiquidity.find(token =>
            checkAddress(token.address, tokenAddress),
          );
          break;
        case 'liquidity':
          rate = lpTokenPrices[tokenAddress.toLowerCase()] || '0';
          break;
        case 'token':
          Object.keys(tokensPrices || {}).forEach(key => {
            if (key && tokensPrices) {
              rate = tokensPrices[key].rate;
            }
          });
          break;
      }

      // Normal tokens fallback here
      if (!response) {
        if (!token) {
          return null;
        }

        const lifiData = await liFiPromise;
        response = {
          ...lifiData,
          rate: rate ?? lifiData?.rate,
        };
      }

      return response;
    },
    {
      refetchIntervalInBackground: true,
      refetchInterval: TIME,
      staleTime: TIME,
      cacheTime: TIME,
    },
  );

  return {
    token: tokenWithBalance ?? (token as TokenAmount | undefined),
    isLoading: isLoading && isFetching,
  };
};
