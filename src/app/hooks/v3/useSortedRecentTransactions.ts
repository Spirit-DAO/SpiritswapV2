// import { useAllTransactions } from '../../state/transactions/hooks';
import { useMemo } from 'react';

export function useSortedRecentTransactions() {
  //TODO
  //   const allTransactions = useAllTransactions();
  const allTransactions = [];

  return useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs
      .filter((tx: any) => new Date().getTime() - tx.addedTime < 86_400_000)
      .sort((a: any, b: any) => b.addedTime - a.addedTime);
  }, [allTransactions]);
}
