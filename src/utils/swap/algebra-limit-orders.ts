import { BigNumber } from 'ethers';
import { CHAIN_ID } from 'constants/index';
import { Contract, MulticallV2, wallet } from 'utils/web3';
import { getProvider } from 'app/connectors/EthersConnector/login';
import contracts from 'constants/contracts';

export const getLimitOrders = async (
  _userAddress: string,
  _signer: any = null,
) => {
  let signer;

  if (_signer) {
    signer = _signer;
  } else {
    const connector = getProvider();
    ({ signer } = await wallet(connector));
  }

  const limitOrderManagerContract = await Contract(
    contracts.v3LimitOrderManager[CHAIN_ID],
    'v3LimitOrderManager',
  );

  const balanceResult = await limitOrderManagerContract.balanceOf(_userAddress);

  const accountBalance: number | undefined = +balanceResult;

  if (!accountBalance) return;

  let tokenIdsArgs: any[] = [];

  for (let i = 0; i < accountBalance; i++) {
    tokenIdsArgs.push([_userAddress, i]);
  }

  const calls: any[] = [];

  for (let i = 0; i < tokenIdsArgs.length; i++) {
    calls.push({
      address: contracts.v3LimitOrderManager[CHAIN_ID],
      name: 'tokenOfOwnerByIndex',
      params: [tokenIdsArgs[i]],
    });
  }

  const requests = await MulticallV2(
    calls,
    'v3LimitOrderManager',
    CHAIN_ID,
    'rpc',
  );

  const tokenIds = requests
    ? requests.map(tokenId => BigNumber.from(tokenId))
    : [];

  const callsPositions: any[] = [];

  for (let i = 0; i < tokenIds.length; i++) {
    callsPositions.push({
      address: contracts.v3LimitOrderManager[CHAIN_ID],
      name: 'limitPositions',
      params: [tokenIds[i]],
    });
  }

  const limitPositions: any = await MulticallV2(
    callsPositions,
    'v3LimitOrderManager',
    CHAIN_ID,
    'rpc',
  );

  if (tokenIds && limitPositions) {
    return limitPositions.map((result, i) => {
      const tokenId = tokenIds[i];

      const {
        token0,
        token1,
        limitPosition: {
          amount,
          tick,
          liquidity,
          liquidityInit,
          depositedAmount,
        },
      } = result;

      return {
        tokenId,
        token0,
        token1,
        amount,
        tick,
        liquidity,
        liquidityInit,
        depositedAmount,
      };
    });
  }
  return [];
};
