import { request } from './covalent';

export const YIELD_MONITOR_ENDPOINT = 'https://app.yieldmonitor.io/api';

export const get = (endpoint: string, dexName = 'SpiritSwap') => {
  return request(
    `${YIELD_MONITOR_ENDPOINT}/${endpoint}?partner=SpiritSwap&dexName=${dexName}`,
  );
};

export const getDexPools = async () => {
  const pools = await get('symbol/getPoolsForDex');

  return pools.data;
};
