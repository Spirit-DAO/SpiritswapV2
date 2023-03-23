import { gql } from '@apollo/client';
import { client, clientV2 } from 'utils/apollo/client';

import {
  FTM_TOKEN_NULL_ADDRESS,
  REACT_APP_FACTORY_ADDRESS,
  USDC,
  WFTM,
} from 'constants/index';

export const getLpFromApollo = async (
  tokenAddressA: string,
  tokenAddressB: string,
) => {
  const results = await client.query({
    query: gql(`
    query pair {
      pairs(where: {token0_contains_nocase: "${tokenAddressA}", token1_contains_nocase: "${tokenAddressB}"}) {
        id
        token0 {
          id
          name
          symbol
        }
        token1 {
          name
          symbol
          id
        }
      }
    }
    `),
  });

  return results;
};

export const getFtmPriceByPool = async () => {
  try {
    const { data } = await clientV2.query({
      query: gql(`
      query pair {
        pairs(where: {token0_contains_nocase: "${USDC.address}", token1_contains_nocase: "${WFTM.address}"}) {
          reserve1
          reserve0
        }
      }
      `),
    });

    if (data.pairs[0]) {
      const pair = data.pairs[0];
      const reserve0 = pair.reserve0;
      const reserve1 = pair.reserve1;
      const ftmPrice = reserve0 / reserve1;
      return ftmPrice;
    }
    return 0;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

export const getPricesByPools = async (address: string) => {
  try {
    const FTMPRICE = await getFtmPriceByPool();
    if (
      address.toLowerCase() === WFTM.address.toLowerCase() ||
      address.toLowerCase() ===
        '0x0000000000000000000000000000000000000000'.toLowerCase()
    ) {
      return FTMPRICE;
    }
    const { data: firstCall } = await clientV2.query({
      query: gql(`
    query pair {
      pairs(where: {token0_contains_nocase: "${address}", token1_contains_nocase: "${WFTM.address}", isStable: false}) {
        id
        reserve0
        reserve1
        token0 { id name}
        token1 { id name }
      }
    }
    `),
    });

    let reserve0 = 0;
    let reserve1 = 0;
    let wftmIsToken0 = false;

    // no hay primer combinacion ==? address/usdc
    if (!firstCall.pairs.length) {
      const { data: secondCall } = await clientV2.query({
        query: gql(`
      query pair {
        pairs(where: {token0_contains_nocase: "${WFTM.address}", token1_contains_nocase: "${address}", isStable: false}) {
          id
          reserve0
          reserve1
          token0 { id name}
          token1 { id name }
        }
      }
      `),
      });

      if (!secondCall.pairs.length) {
        return 0;
      }

      const lp = secondCall.pairs[0];
      reserve0 = lp.reserve0;
      reserve1 = lp.reserve1;
      wftmIsToken0 = true;
    } else {
      const lp = firstCall.pairs[0];
      reserve0 = lp.reserve0;
      reserve1 = lp.reserve1;
    }

    if (wftmIsToken0) {
      return (reserve0 / reserve1) * FTMPRICE;
    }

    return (reserve1 / reserve0) * FTMPRICE;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

export const ALL_TOKENS = gql`
  query tokens($skip: Int!) {
    tokens(first: 500, skip: $skip) {
      id
      name
      symbol
      totalLiquidity
    }
  }
`;

export const GET_TOTAL_VALUE = gql`
query spiritswapFactories {
  spiritswapFactories(
   where: { id: "${REACT_APP_FACTORY_ADDRESS}" }) {
    id
    totalLiquidityUSD
  }}
`;

export const GET_TOTAL_VALUEV2 = gql`
  query uniswapFactories {
    uniswapFactory(id: "0x9d3591719038752db0c8beee2040ffcc3b2c6b9c") {
      id
      totalLiquidityUSD
    }
  }
`;

export const GET_TOTAL_VOLUME = gql`
query spiritswapFactories {
  spiritswapFactories(
   where: { id: "${REACT_APP_FACTORY_ADDRESS}" }) {
    id
    totalVolumeUSD
  }}
`;

export const GET_TOTAL_VOLUMEV2 = gql`
  query uniswapFactories {
    uniswapFactory(id: "0x9d3591719038752db0c8beee2040ffcc3b2c6b9c") {
      id
      totalVolumeUSD
    }
  }
`;
