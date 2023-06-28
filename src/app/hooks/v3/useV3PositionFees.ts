import { useEffect, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { Pool, Currency, CurrencyAmount } from '../../../v3-sdk';
import { unwrappedToken } from 'utils/v3/wrappedCurrency';
import { Contract } from '@ethersproject/contracts';
import contracts from 'constants/contracts';

import NonfungiblePositionManagerABI from 'utils/web3/abis/v3/nonfungiblePositionManager.json';
import { CHAIN_ID } from 'constants/index';
import { Web3Provider } from '@ethersproject/providers';

const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1);

// compute current + counterfactual fees for a v3 position
export function useV3PositionFees(
  pool?: Pool,
  tokenId?: BigNumber,
  asWETH = false,
):
  | [CurrencyAmount<Currency>, CurrencyAmount<Currency>]
  | [undefined, undefined] {
  const [positionManager, setPositionManager] = useState<Contract>();

  const [owner, setOwner] = useState<any>();

  useEffect(() => {
    async function fetchProvider() {
      const provider = new Web3Provider(window.ethereum);
      const contract = new Contract(
        contracts.v3NonfungiblePositionManager[CHAIN_ID],
        NonfungiblePositionManagerABI,
        provider,
      );
      setPositionManager(contract);
    }

    fetchProvider();
  }, []);

  useEffect(() => {
    async function fetchOwner() {
      if (!positionManager) return;

      const owner = await positionManager.callStatic.ownerOf(tokenId);

      setOwner(owner);
    }

    if (positionManager) {
      fetchOwner();
    }
  }, [pool, tokenId, asWETH, positionManager]);

  const tokenIdHexString = tokenId;

  // TODO find a way to get this into multicall
  // latestBlockNumber is included to ensure data stays up-to-date every block
  const [amounts, setAmounts] = useState<[BigNumber, BigNumber]>();
  useEffect(() => {
    let stale = false;

    if (positionManager && tokenIdHexString && owner) {
      positionManager.callStatic
        .collect(
          {
            tokenId: tokenIdHexString,
            recipient: owner, // some tokens might fail if transferred to address(0)
            amount0Max: MAX_UINT128,
            amount1Max: MAX_UINT128,
          },
          { from: owner }, // need to simulate the call as the owner
        )
        .then((results: any) => {
          if (!stale) setAmounts([results.amount0, results.amount1]);
        });
    }

    return () => {
      stale = true;
    };
  }, [positionManager, tokenIdHexString, owner]);

  if (pool && amounts) {
    return [
      CurrencyAmount.fromRawAmount(
        !asWETH ? unwrappedToken(pool.token0) : pool.token0,
        amounts[0].toString(),
      ),
      CurrencyAmount.fromRawAmount(
        !asWETH ? unwrappedToken(pool.token1) : pool.token1,
        amounts[1].toString(),
      ),
    ];
  } else {
    return [undefined, undefined];
  }
}
