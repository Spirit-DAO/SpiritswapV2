import { gql } from '@apollo/client';
import { clientV3, farmingV3 } from '../client';

// export const multiFetcher = async (items, fetcher, query, field) => {
//   return Promise.allSettled(items.map(item => fetcher(query, {
//       [field]: item
//   }))).then(results => results.map(result => result.status === 'fulfilled' ? result.value : null))
// }

export const getPool = async (poolAddress: string) => {
  const {
    data: { pool },
  } = await clientV3.query({
    query: fetchPoolQuery,
    variables: {
      poolId: poolAddress.toLowerCase(),
    },
  });

  return pool;
};

export const getToken = async (tokenAddress: string) => {
  const {
    data: { token },
  } = await farmingV3.query({
    query: fetchTokenQuery,
    variables: {
      tokenId: tokenAddress,
    },
  });
  return token;
};

export const getEternalFarmings = async () => {
  const {
    data: { eternalFarmings },
  } = await farmingV3.query({
    query: fetchEternalFarmingsQuery,
  });
  return eternalFarmings;
};

export const getEternalFarming = async farmingId => {
  const {
    data: { eternalFarming },
  } = await farmingV3.query({
    query: fetchEternalFarmingQuery,
    variables: {
      farmingId,
    },
  });

  return eternalFarming;
};

export const getEternalFarmingFromPool = async poolAddress => {
  const {
    data: { eternalFarmings },
  } = await farmingV3.query({
    query: fetchEternalFarmingFromPool,
    variables: {
      poolAddress: poolAddress,
    },
  });
  return eternalFarmings;
};

export const getTransferredPositions = async account => {
  const {
    data: { deposits },
  } = await farmingV3.query({
    query: fetchTransferredPositionsQuery,
    variables: {
      account,
    },
  });

  return deposits;
};

export const getPositionsOnEternalFarming = async account => {
  const {
    data: { deposits },
  } = await farmingV3.query({
    query: fetchPositionsOnEternalFarmingQuery,
    variables: {
      account,
    },
  });

  return deposits;
};

export const getTransferredPositionsForPool = async (
  account,
  poolId,
  minRangeLength,
) => {
  const {
    data: { deposits },
  } = await farmingV3.query({
    query: fetchTransferredPositionsForPoolQuery,
    variables: {
      account,
      poolId,
      minRangeLength,
    },
  });

  return deposits;
};

export const getAllV3Ticks = async (
  poolAddress: string,
  tickIdxLowerBound: number,
  tickIdxUpperBound: number,
  skip: number,
) => {
  const {
    data: { ticks },
    error,
    loading,
  } = await clientV3.query({
    query: fetchAllV3TicksQuery,
    variables: {
      poolAddress: poolAddress.toLowerCase(),
      tickIdxLowerBound,
      tickIdxUpperBound,
      skip,
    },
  });

  return {
    data: ticks,
    error,
    loading,
  };
};

export const fetchTokenQuery = gql`
  query fetchToken($tokenId: ID) {
    token(id: $tokenId) {
      id
      symbol
      name
      decimals
    }
  }
`;

export const fetchPoolQuery = gql`
  query fetchPool($poolId: ID) {
    pool(id: $poolId) {
      id
      fee
      token0 {
        id
        decimals
        symbol
      }
      token1 {
        id
        decimals
        symbol
      }
      sqrtPrice
      liquidity
      tick
      feesUSD
      untrackedFeesUSD
    }
  }
`;

export const fetchEternalFarmingsQuery = gql`
  query fetchEternalFarmings {
    eternalFarmings(where: { isDetached: false }) {
      id
      rewardToken
      bonusRewardToken
      pool
      startTime
      endTime
      reward
      bonusReward
      rewardRate
      bonusRewardRate
      minRangeLength
      tokenAmountForTier1
      tokenAmountForTier2
      tokenAmountForTier3
      tier1Multiplier
      tier2Multiplier
      tier3Multiplier
      multiplierToken
    }
  }
`;

export const fetchEternalFarmingQuery = gql`
  query fetchEternalFarm($farmingId: ID) {
    eternalFarming(id: $farmingId) {
      id
      rewardToken
      bonusRewardToken
      pool
      startTime
      endTime
      reward
      bonusReward
      rewardRate
      bonusRewardRate
      isDetached
      tier1Multiplier
      tier2Multiplier
      tier3Multiplier
      tokenAmountForTier1
      tokenAmountForTier2
      tokenAmountForTier3
      multiplierToken
    }
  }
`;

export const fetchTransferredPositionsQuery = gql`
  query transferedPositions($account: Bytes) {
    deposits(
      orderBy: id
      orderDirection: desc
      where: { owner: $account, onFarmingCenter: true }
    ) {
      id
      owner
      pool
      L2tokenId
      limitFarming
      eternalFarming
      onFarmingCenter
      rangeLength
    }
  }
`;

export const fetchPositionsOnEternalFarmingQuery = gql`
  query positionsOnEternalFarming($account: Bytes) {
    deposits(
      orderBy: id
      orderDirection: desc
      where: {
        owner: $account
        onFarmingCenter: true
        eternalFarming_not: null
      }
    ) {
      id
      owner
      pool
      L2tokenId
      eternalFarming
      onFarmingCenter
      enteredInEternalFarming
    }
  }
`;

export const fetchTransferredPositionsForPoolQuery = gql`
  query transferedPositionsForPool($account: Bytes, $poolId: Bytes) {
    deposits(
      orderBy: id
      orderDirection: desc
      where: { owner: $account, pool: $poolId, liquidity_not: "0" }
    ) {
      id
      owner
      pool
      L2tokenId
      limitFarming
      eternalFarming
      onFarmingCenter
      enteredInEternalFarming
      tokensLockedLimit
      tokensLockedEternal
      tierLimit
      tierEternal
    }
  }
`;

export const fetchAllV3TicksQuery = gql`
  query surroundingTicks(
    $poolAddress: String!
    $tickIdxLowerBound: BigInt!
    $tickIdxUpperBound: BigInt!
    $skip: Int!
  ) {
    ticks(
      subgraphError: allow
      first: 1000
      skip: $skip
      where: {
        poolAddress: $poolAddress
        tickIdx_lte: $tickIdxUpperBound
        tickIdx_gte: $tickIdxLowerBound
      }
    ) {
      tickIdx
      liquidityGross
      liquidityNet
      price0
      price1
    }
  }
`;

export const fetchEternalFarmingFromPool = gql`
  query eternalFarmingFromPools($poolAddress: String!) {
    eternalFarmings(
      where: { pool: $poolAddress, isDetached: false, rewardRate_gt: 0 }
    ) {
      id
      rewardToken
      bonusRewardToken
      pool
      startTime
      endTime
      reward
      bonusReward
      rewardRate
      bonusRewardRate
      isDetached
    }
  }
`;
