import gql from 'graphql-tag';
import { REACT_APP_FACTORY_ADDRESS } from 'constants/index';

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
