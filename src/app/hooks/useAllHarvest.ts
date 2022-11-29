import { useCallback } from 'react';
import { gaugeHarvest, harvest } from 'utils/web3/actions/farm';

const useAllHarvest = (farmPidsV1, farmAddressesV2) => {
  const handleHarvestAll = useCallback(async () => {
    const harvestPromises = farmPidsV1.reduce(
      (accum, pid) => [...accum, harvest(pid)],
      [],
    );
    const harvestPromisesV2 = farmAddressesV2.reduce((accum, farmAddress) => {
      return [...accum, gaugeHarvest(farmAddress)];
    }, []);

    return Promise.all(harvestPromises.concat(harvestPromisesV2));
  }, [farmAddressesV2, farmPidsV1]);

  return handleHarvestAll;
};

export default useAllHarvest;
