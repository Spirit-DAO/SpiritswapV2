import { getProvider } from 'app/connectors/EthersConnector/login';
import addresses from 'constants/contracts';
import { CHAIN_ID } from 'constants/index';
import { Contract } from '../../contracts';

export const v3LimitOrderManagerContract = async (
  _connector = getProvider(),
  _chainId = CHAIN_ID,
) => {
  const connector = await _connector;
  const limitOrderManagerInstance = await Contract(
    addresses.v3LimitOrderManager[CHAIN_ID],
    'v3LimitOrderManager',
    connector,
    _chainId,
  );

  return limitOrderManagerInstance;
};
