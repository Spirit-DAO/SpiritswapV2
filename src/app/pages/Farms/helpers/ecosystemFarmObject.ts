import { QuoteToken } from 'constants/types';

export const ecosystemFarmObject = (
  farm,
  firstTokenDetails,
  secondTokenDetails,
  lpAddress,
  tokenAddress,
  type,
) => {
  return {
    ecosystem: type,
    rewardToken: secondTokenDetails[0]?.symbol,
    isGauge: false,
    lpSymbol:
      secondTokenDetails[0]?.symbol + '-' + firstTokenDetails[0]?.symbol,
    lpAddress: lpAddress,
    tokenSymbol: 'symbol',
    tokenAddresses: {
      421611: '0x0',
      42161: tokenAddress,
    },
    quoteTokenSymbol: QuoteToken.FTM,
    quoteTokenAdresses: {
      421611: '0x0',
      42161: farm.token1,
    },

    statistics: {
      exchange: '',
      token_0: {
        contract_ticker_symbol: firstTokenDetails[0]?.symbol,
        contract_name: firstTokenDetails[0].name,
        contract_address: firstTokenDetails[0].address,
      },
      token_1: {
        contract_ticker_symbol: secondTokenDetails[0]?.symbol,
        contract_name: secondTokenDetails[0].name,
        contract_address: secondTokenDetails[0].address,
      },
      volume_in_24h: 'WIP',
      total_liquidity_quote: 0,
      total_supply: 'WIP',
      fee_24h_quote: 'WIP',
      volume_24h_quote: 'WIP',
      lpApyNumber: 0,
      lpApy: 'WIP',
      aprRange: [],
    },
  };
};
