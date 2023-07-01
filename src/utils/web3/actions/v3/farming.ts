import { getProvider } from 'app/connectors/EthersConnector/login';
import addresses from 'constants/contracts';
import { CHAIN_ID } from 'constants/index';
import { Contract } from '../../contracts';

export const v3FarmingCenterContract = async (
  _connector = getProvider(),
  _chainId = CHAIN_ID,
) => {
  const connector = await _connector;
  const farmingCenterInstance = await Contract(
    addresses.v3FarmingCenter[CHAIN_ID],
    'v3FarmingCenter',
    connector,
    _chainId,
  );

  return farmingCenterInstance;
};
