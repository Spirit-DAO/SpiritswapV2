import { REACT_APP_FACTORY_ADDRESS } from 'constants/index';
import gql from 'graphql-tag';

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
