import { useState } from 'react';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { transactionResponse } from 'utils/web3/actions/utils';
import { claimBribes } from 'utils/web3';
import useWallets from 'app/hooks/useWallets';

export const useClaimBribes = (boostedV2, boostedStable) => {
  const { addToQueue } = Web3Monitoring();
  const { account: userAddress } = useWallets();
  const [isLoading, setIsLoading] = useState(false);

  const claimBribeRewards = async () => {
    try {
      setIsLoading(true);
      const v2Address: string[] = [];
      const stableAddress: string[] = [];
      for (let i = 0; i < boostedV2.length; i++) {
        const pair = boostedV2[i]?.fulldata;
        if (pair) {
          const { bribeAddress, userRewardsEarnsUSD } = pair;
          const hasEarns =
            Number(userRewardsEarnsUSD[0]) + Number(userRewardsEarnsUSD[1]) > 0;
          if (hasEarns) v2Address.push(bribeAddress);
        }
      }
      for (let i = 0; i < boostedStable.length; i++) {
        const pair = boostedStable[i]?.fulldata;
        if (pair) {
          const { bribeAddress, userRewardsEarnsUSD } = pair;
          const hasEarns =
            Number(userRewardsEarnsUSD[0]) + Number(userRewardsEarnsUSD[1]) > 0;
          if (hasEarns) stableAddress.push(bribeAddress);
        }
      }
      if (v2Address.length) {
        const txV2 = await claimBribes(v2Address, userAddress, 1);
        addToQueue(
          transactionResponse('inspirit.claimBribeRewards', {
            tx: txV2,
            operation: 'BRIBE',
            uniqueMessage: {
              text: 'Claiming bribe',
            },
            update: 'bribes',
            updateTarget: 'user',
          }),
        );
        await txV2.wait();
      }
      if (stableAddress.length) {
        const txStable = await claimBribes(stableAddress, userAddress, 0);
        addToQueue(
          transactionResponse('inspirit.claimBribeRewards', {
            tx: txStable,
            operation: 'BRIBE',
            uniqueMessage: {
              text: 'Claiming bribe',
            },
            update: 'bribes',
            updateTarget: 'user',
          }),
        );
        await txStable.wait();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw '';
    }
  };

  return {
    isLoading,
    claimBribeRewards,
  };
};
