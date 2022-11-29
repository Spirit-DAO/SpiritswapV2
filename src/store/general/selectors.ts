import { RootState } from 'store';

export const selectSpiritInfo = (state: RootState) => state.general.spiritInfo;
export const selectLiquidityPools = (state: RootState) =>
  state.general.liquidity_pools;
export const selectSaturatedGauges = (state: RootState) =>
  state.general.saturated_gauges;
export const selectTotalSpiritSupply = (state: RootState) =>
  state.general.total_spirit_supply;
export const selectTotalSpiritValue = (state: RootState) =>
  state.general.total_spirit_value;
export const selectAverageSpiritUnlockTime = (state: RootState) =>
  state.general.average_spirit_unluck_time;
export const selectLastSpiritDistribution = (state: RootState) =>
  state.general.last_spirit_distribution;
export const selectLastSpiritDistributionValue = (state: RootState) =>
  state.general.last_spirit_distribution_value;
export const selectNextSpiritDistribution = (state: RootState) =>
  state.general.next_spirit_distribution;
export const selectTotalSpiritLocked = (state: RootState) =>
  state.general.total_spirit_locked;
export const selectTotalSpiritLockedValue = (state: RootState) =>
  state.general.total_spirit_locked_value;
export const selectAprPercentage = (state: RootState) =>
  state.general.apr_percentage;
export const selectStatisticsFromTimestamp = (state: RootState) =>
  state.general.statistics_from;
export const selectInSpiritPerSpirit = (state: RootState) =>
  state.general.inspirit_per_spirit;
export const selectUserCustomTokens = (state: RootState) =>
  state.general.userCustomTokens;
export const selectIsHomePage = (state: RootState) => state.general.isHomePage;
export const selectTokensToShow = (state: RootState) =>
  state.general.tokensToShow;
export const selectSwapModeIndex = (state: RootState) =>
  state.general.swapModeIndex;
export const selectSpiritWarsStatistics = (state: RootState) =>
  state.general.spiritWarsStatistics;
export const selectSpiritWarsData = (state: RootState) =>
  state.general.spiritWarsData;
export const selectMarketCap = (state: RootState) => state.general.marketCap;
export const selectTVL = (state: RootState) => state.general.tvl;
export const selectFtmInfo = (state: RootState) => state.general.ftmInfo;
export const selectLpPrices = (state: RootState) => state.general.lp_prices;
