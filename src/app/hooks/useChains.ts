import { LiFi } from 'config/lifi';
import { useCallback } from 'react';
import { useQuery } from 'react-query';

export const useChains = () => {
  const { data, ...other } = useQuery(['chains'], LiFi.getChains);

  const getChainById = useCallback(
    (chainId: number) => {
      const chain = data?.find(chain => chain.id === chainId);
      // if (!chain) {
      //   throw new Error('Chain not found or chainId is invalid.');
      // }
      return chain;
    },
    [data],
  );

  return { chains: data, getChainById, ...other };
};
