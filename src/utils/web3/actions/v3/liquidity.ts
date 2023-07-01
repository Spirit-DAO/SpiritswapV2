import { getProvider } from 'app/connectors/EthersConnector/login';
import addresses from 'constants/contracts';
import { CHAIN_ID } from 'constants/index';
import { Contract } from '../../contracts';

export const v3NonfungiblePositionManagerContract = async (
  _connector = getProvider(),
  _chainId = CHAIN_ID,
) => {
  const connector = await _connector;
  const nonfungiblePositionManagerInstance = await Contract(
    addresses.v3NonfungiblePositionManager[CHAIN_ID],
    'v3NonfungiblePositionManager',
    connector,
    _chainId,
  );

  return nonfungiblePositionManagerInstance;
};
