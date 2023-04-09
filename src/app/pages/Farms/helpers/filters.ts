import { IFarm, FarmType, EcosystemFarmType } from 'app/interfaces/Farm';

export const handleFarmData = (data, index) => {
  switch (index) {
    case 0:
      return data;
    case FarmType.CLASSIC:
      return data.filter(farm => farm.type === 'variable');
    case FarmType.STABLE:
      return data.filter(farm => farm.type === 'stable');
    // case FarmType.ADMIN:
    //   return data.filter(farm => farm.type === 'admin');
    case FarmType.CONCENTRATED:
      return data.filter(farm => farm.type === 'concentrated');

    default:
      return data;
  }
};

export const filterByQuery = (pool: IFarm, query: string) => {
  return pool?.title?.toLowerCase().includes(query.toLowerCase());
};

export const filterByState = (
  pool: IFarm,
  filterByStaked,
  filterByInactive,
  farmsStaked,
  concentratedFarmsStaked,
) => {
  const lpFarmId = `${pool.lpAddress?.toLowerCase()}`;
  const concentratedFarmsId = pool.id;
  const hasConcentratedPositions = concentratedFarmsStaked.some(
    stake => stake.eternalAvailable === concentratedFarmsId,
  );

  const staked = farmsStaked[lpFarmId]
    ? parseFloat(farmsStaked[lpFarmId].amount) > 0
    : hasConcentratedPositions
    ? true
    : false;
  const inactive = !(parseFloat(pool.apr!) > 0);

  const filterType = [filterByStaked, filterByInactive];
  const filterValue = [staked, inactive];

  const filterResult = filterType.every((type, index) => {
    if (type) {
      return filterValue[index];
    }

    return true;
  });

  return filterByInactive ? filterResult : filterResult && !inactive;
};
