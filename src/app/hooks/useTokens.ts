import { tokens as allTokens } from 'constants/tokens';
import { useAppSelector } from 'store/hooks';
import { selectUserCustomTokens } from 'store/general/selectors';
import { Contract } from 'utils/web3';
import { UserCustomToken } from 'app/interfaces/General';
import { CHAIN_ID } from 'constants/index';
import { useMemo } from 'react';
import { LiFi } from 'config/lifi';
import { useQuery } from 'react-query';

export const useTokens = (chainId = CHAIN_ID, isBridge) => {
  const {
    data: bridgeTokens,
    isLoading,
    isFetching,
  } = useQuery(['tokens', chainId], async () => {
    return (
      await LiFi.getPossibilities({ include: ['tokens'], chains: [chainId] })
    ).tokens;
  });

  const nonVerified = useAppSelector(selectUserCustomTokens);

  const getAddressTokenInfo = async (address: string) => {
    try {
      const contract = await Contract(address, 'erc20');
      const name = await contract.name();
      const symbol = await contract.symbol();
      const decimals = await contract.decimals();
      const unverifiedToken: UserCustomToken[] = [
        {
          address,
          symbol,
          name,
          decimals,
          chainId,
          addedByUser: false,
        },
      ];
      return unverifiedToken;
    } catch (e) {
      return [];
    }
  };

  const tokens = useMemo(() => {
    if (isBridge) return bridgeTokens;
    if (nonVerified && nonVerified.length)
      return [...allTokens, ...nonVerified];

    return allTokens;
  }, [isBridge, bridgeTokens, nonVerified]);

  return { tokens, isLoading, isFetching, getAddressTokenInfo };
};
