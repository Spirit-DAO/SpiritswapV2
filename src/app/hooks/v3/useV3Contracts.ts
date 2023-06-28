import contracts from 'constants/contracts';

import { Contract } from 'utils/web3';
import { CHAIN_ID } from 'constants/index';

export async function useMulticall2Contract() {
  return await Contract(contracts.v3Multicall[CHAIN_ID], 'v3Multicall');
}

export async function useV3NFTPositionManagerContract(
  withSignerIfPossible?: boolean,
) {
  return await Contract(
    contracts.v3NonfungiblePositionManager[CHAIN_ID],
    'v3NonfungiblePositionManager',
  );
}

export async function useV3Quoter() {
  return await Contract(contracts.v3AlgebraQuoter[CHAIN_ID], 'v3AlgebraQuoter');
}

export async function useV3FarmingCenterContract() {
  return await Contract(contracts.v3FarmingCenter[CHAIN_ID], 'v3FarmingCenter');
}
