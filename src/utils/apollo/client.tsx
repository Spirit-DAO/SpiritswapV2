import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/layer3org/spiritswap-analytics',
  cache: new InMemoryCache(),
});
export const clientV2 = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/spirit-dao/spiritswapv2-analytics',
  cache: new InMemoryCache(),
});
export const clientV3 = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/iliaazhel/spirit-info',
  cache: new InMemoryCache(),
});
export const farmingV3 = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/iliaazhel/spirit-farming',
  cache: new InMemoryCache(),
});
