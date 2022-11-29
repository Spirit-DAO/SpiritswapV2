import { RootState } from 'store';

export const selectAddress = (state: RootState) => state.user.address;
export const selectIsLoggedIn = (state: RootState) => !!state.user.address;
export const selectTokens = (state: RootState) => state.user.tokens;
export const selectLiquidity = (state: RootState) => state.user.liquidity;
export const selectLiquidityWallet = (state: RootState) =>
  state.user.liquidity_wallet;
export const selectSobLiquidityWallet = (state: RootState) =>
  state.user.sob_liquidity_wallet;
export const selectedWeightedLiquidityWallet = (state: RootState) =>
  state.user.weighted_liquidity_wallet;
export const selectFarmsStaked = (state: RootState) => state.user.farms_staked;
export const selectTokensValue = (state: RootState) => state.user.tokens_value;
export const selectWallet = (state: RootState) => state.user.wallet;
export const selectLiquidityValue = (state: RootState) =>
  state.user.liquidity_value;
export const selectStakedValue = (state: RootState) => state.user.staked_value;
export const selectPortfolioValue = (state: RootState) =>
  state.user.portfolio_value;
export const selectPortfolioPercentValue = (state: RootState) =>
  state.user.portfolio_percent_value;
export const selectLockedInSpiritAmount = (state: RootState) =>
  state.user.inspirit_locked_amount;
export const selectBribesClaimableAmount = (state: RootState) =>
  state.user.bribes_claimable_amount;
export const selectLockedInsSpiritEndDate = (state: RootState) =>
  state.user.inspirit_locked_end_date;
export const selectInspiritUserBalance = (state: RootState) =>
  state.user.inspirit_balance;
export const selectSpiritClaimableAmount = (state: RootState) =>
  state.user.spirit_claimable_amount;
export const selectBoostedFarmVotes = (state: RootState) =>
  state.user.boosted_farm_votes;
export const selectSpiritBalance = (state: RootState) =>
  state.user.spirit_balance;
export const selectInspiritAllowance = (state: RootState) =>
  state.user.inspirit_allowance;
export const selectPendingTransactions = (state: RootState) =>
  state.user.pending_transactions;
export const selectBalanceUpdates = (state: RootState) =>
  state.user.balance_updates;
export const selectLimitOrders = (state: RootState) => state.user.limit_orders;
export const selectFarmRewards = (state: RootState) => state.user.farm_rewards;
export const selectTrackedTokens = (state: RootState) =>
  state.user.tracked_tokens;
export const selectBridgeChains = (state: RootState) =>
  state.user.bridge_chains;
export const selectBridgeTokensFrom = (state: RootState) =>
  state.user.bridge_wallet_from;
export const selectBridgeTokensTo = (state: RootState) =>
  state.user.bridge_wallet_to;
export const selectShowPortfolio = (state: RootState) =>
  state.user.showPortfolio;
export const selectHistoricalPortfolioValue = (state: RootState) =>
  state.user.historical_portfolio_value;
export const selectLimitOrdersTotalValue = (state: RootState) =>
  state.user.limitOrdersTotalValue;
export const selectLendAndBorrowData = (state: RootState) =>
  state.user.lendAndBorrowData;
