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
) => {
  const lpFarmId = `${pool.lpAddress?.toLowerCase()}`;
  const staked = farmsStaked[lpFarmId]
    ? parseFloat(farmsStaked[lpFarmId].amount) > 0
    : false;
  const inactiveFarms: boolean = [
    'SPIRIT + sinSPIRIT',
    'SCARAB + GSCARAB',
    'FTM + GOHM',
  ].includes(pool.title);
  const inactive: boolean = !(parseFloat(pool.apr!) > 0);

  const globalInactive = inactiveFarms ? inactiveFarms : inactive;

  const filterType = [filterByStaked, filterByInactive];
  const filterValue = [staked, globalInactive];

  const filterResult = filterType.every((type, index) => {
    if (type) {
      return filterValue[index];
    }

    return true;
  });

  return filterByInactive ? filterResult : filterResult && !globalInactive;
};
