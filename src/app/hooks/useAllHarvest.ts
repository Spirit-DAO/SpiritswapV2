import { useCallback } from 'react';
import {
  gaugeHarvest,
  harvest,
  harvestConcentratedFarm,
} from 'utils/web3/actions/farm';

const useAllHarvest = (farmPidsV1, farmAddressesV2, eternalFarmings) => {
  const handleHarvestAll = useCallback(async () => {
    const harvestPromises = farmPidsV1.reduce(
      (accum, pid) => [...accum, harvest(pid)],
      [],
    );
    const harvestPromisesV2 = farmAddressesV2.reduce((accum, farmAddress) => {
      return [...accum, gaugeHarvest(farmAddress)];
    }, []);
    const eternalPromises = eternalFarmings.reduce(
      (accum, { eternalFarming, tokenId }) => {
        return [
          ...accum,
          harvestConcentratedFarm(
            eternalFarming.owner,
            eternalFarming.rewardToken.id,
            eternalFarming.bonusRewardToken.id,
            eternalFarming.pool.id,
            eternalFarming.nonce,
            tokenId,
          ),
        ];
      },
      [],
    );

    return Promise.all(
      harvestPromises.concat(harvestPromisesV2).concat(eternalPromises),
    );
  }, [farmAddressesV2, farmPidsV1, eternalFarmings]);

  return handleHarvestAll;
};

export default useAllHarvest;
