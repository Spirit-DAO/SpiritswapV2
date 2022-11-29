import { gql } from '@apollo/client';
import { client } from 'utils/apollo/client';

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
