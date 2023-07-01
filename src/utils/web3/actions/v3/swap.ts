import { getProvider } from 'app/connectors/EthersConnector/login';
import addresses from 'constants/contracts';
import { CHAIN_ID } from 'constants/index';
import { Contract } from '../../contracts';

export const v3AlgebraQuoterContract = async (
  _connector = getProvider(),
  _chainId = CHAIN_ID,
) => {
  const connector = await _connector;
  const quoterInstance = await Contract(
    addresses.v3AlgebraQuoter[CHAIN_ID],
    'v3AlgebraQuoter',
    connector,
    _chainId,
  );

  return quoterInstance;
};
