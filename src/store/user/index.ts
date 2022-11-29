import { createSlice } from '@reduxjs/toolkit';
import { Token } from 'app/interfaces/General';
import { LendAndBorrowItem } from 'app/pages/Portfolio/components/LendAndBorrowPanel/LendAndBorrowPanel.d';
import { checkAddress } from 'app/utils';
import {
  tokenData,
  BoostedFarmVoteData,
  FarmRewardInfo,
  balanceReturnData,
} from 'utils/data';
import { GelattoLimitOrder } from 'utils/swap/types';
import { Web3TxData, BalanceUpdate } from 'utils/web3/types';

const initialState: {
  address: string;
  spirit_balance: number;
  tokens: balanceReturnData;
  wallet: Array<tokenData>;
  liquidity_wallet: Array<tokenData> | null;
  sob_liquidity_wallet: Array<tokenData>;
  weighted_liquidity_wallet: Array<tokenData>;
  liquidity: balanceReturnData;
  tokens_value: number;
  liquidity_value: number;
  staked_value: number;
  portfolio_value: number;
  portfolio_percent_value: number;
  inspirit_locked_amount: string;
  inspirit_locked_end_date: number;
  inspirit_balance: string;
  farms_staked: { [key: string]: tokenData };
  spirit_claimable_amount: string;
  bribes_claimable_amount: number | undefined;
  boosted_farm_votes: Array<BoostedFarmVoteData>;
  inspirit_allowance: number;
  pending_transactions: Web3TxData[];
  farm_rewards: FarmRewardInfo[] | null;
  limit_orders: GelattoLimitOrder[];
  tracked_tokens: Token[];
  bridge_chains: string[];
  bridge_wallet_from: Array<tokenData>;
  bridge_wallet_to: Array<tokenData>;
  showPortfolio: boolean;
  balance_updates: Array<BalanceUpdate>;
  limitOrdersTotalValue: number;
  historical_portfolio_value: any;
  lendAndBorrowData: {
    suppliedTokens: Array<LendAndBorrowItem>;
    borrowedTokens: Array<LendAndBorrowItem>;
  };
} = {
  address: '',
  spirit_balance: 0,
  tokens: {
    tokenList: [],
    diffAmount: '0',
    diffAmountValue: 0,
    diffPercent: '0',
    diffPercentValue: 0,
    totalValue: '0',
    total24Value: '0',
    totalValueNumber: 0,
    total24ValueNumber: 0,
  },
  liquidity: {
    farmList: [],
    diffAmount: '0',
    diffAmountValue: 0,
    diffPercent: '0',
    diffPercentValue: 0,
    totalValue: '0',
    total24Value: '0',
    totalValueNumber: 0,
    total24ValueNumber: 0,
  },
  liquidity_wallet: [],
  sob_liquidity_wallet: [],
  weighted_liquidity_wallet: [],
  farms_staked: {},
  tokens_value: 0,
  wallet: [],
  liquidity_value: 0,
  staked_value: 0,
  portfolio_value: 0,
  portfolio_percent_value: 0,
  inspirit_locked_amount: '0',
  inspirit_locked_end_date: 0,
  inspirit_balance: '0',
  spirit_claimable_amount: '0',
  bribes_claimable_amount: undefined,
  boosted_farm_votes: [],
  inspirit_allowance: 0,
  pending_transactions: [],
  balance_updates: [],
  limit_orders: [],
  farm_rewards: null,
  tracked_tokens: [],
  bridge_chains: [],
  bridge_wallet_from: [],
  bridge_wallet_to: [],
  showPortfolio: false,
  limitOrdersTotalValue: 0,
  historical_portfolio_value: {},
  lendAndBorrowData: {
    suppliedTokens: [],
    borrowedTokens: [],
  },
};

export const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    setShowPortfolio: (state, action) => {
      state.showPortfolio = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setBridgeChains: (state, action) => {
      state.bridge_chains = action.payload;
    },
    setTokens: (state, action) => {
      state.tokens = action.payload;
    },
    setLiquidity: (state, action) => {
      state.liquidity = action.payload;
    },
    setFarmsStaked: (state, action) => {
      state.farms_staked = action.payload;
    },
    setTokensValue: (state, action) => {
      state.tokens_value = action.payload;
    },
    setLiquidityValue: (state, action) => {
      state.liquidity_value = action.payload;
    },
    setStakedValue: (state, action) => {
      state.staked_value = action.payload;
    },
    setPortfolioValue: (state, action) => {
      state.portfolio_value = action.payload;
    },
    setPortfolioPercentValue: (state, action) => {
      state.portfolio_percent_value = action.payload;
    },
    setLockedInSpiritAmount: (state, action) => {
      state.inspirit_locked_amount = action.payload;
    },
    setLockedInSpiritEndDate: (state, action) => {
      state.inspirit_locked_end_date = action.payload;
    },
    setInspiritUserBalance: (state, action) => {
      state.inspirit_balance = action.payload;
    },
    setSpiritClaimableAmount: (state, action) => {
      state.spirit_claimable_amount = action.payload;
    },
    setBribesClaimableAmount: (state, action) => {
      state.bribes_claimable_amount = action.payload;
    },
    setBoostedFarmVotes: (state, action) => {
      state.boosted_farm_votes = action.payload;
    },
    setSpiritBalance: (state, action) => {
      state.spirit_balance = action.payload;
    },
    setLimitOrdersValue: (state, action) => {
      state.limitOrdersTotalValue = action.payload;
    },
    setUserWallet: (state, action) => {
      state.wallet = action.payload;
    },
    setBridgeWalletFrom: (state, action) => {
      state.bridge_wallet_from = action.payload;
    },
    setBridgeWalletTo: (state, action) => {
      state.bridge_wallet_to = action.payload;
    },
    setUserLiquidityWallet: (state, action) => {
      state.liquidity_wallet = action.payload;
    },
    setUserSobLiquidityWallet: (state, action) => {
      state.sob_liquidity_wallet = action.payload;
    },
    setUserWeightedLiquidityWallet: (state, action) => {
      state.weighted_liquidity_wallet = action.payload;
    },
    setInspiritAllowance: (state, action) => {
      state.inspirit_allowance = action.payload;
    },
    setPendingTransactions: (state, action) => {
      state.pending_transactions = action.payload;
    },
    addNewLiquidity: (state, action) => {
      const oldLiquidityWallet = state.liquidity_wallet
        ? [...state.liquidity_wallet]
        : [];
      const alreadyAddedLiquidity =
        Boolean(oldLiquidityWallet.length) &&
        oldLiquidityWallet.find(token =>
          checkAddress(action.payload.address, token.address),
        );
      !alreadyAddedLiquidity && oldLiquidityWallet.push(action.payload);
      state.liquidity_wallet = oldLiquidityWallet;
    },
    setNewPendingTransactions: (state, action) => {
      if (state.pending_transactions) {
        const oldTransactions = JSON.parse(
          JSON.stringify(state.pending_transactions),
        );
        state.pending_transactions = [...oldTransactions, action.payload];
      } else {
        state.pending_transactions = [action.payload];
      }
    },
    // Provide a hash to remove
    removePendingTransaction: (state, action) => {
      const oldTransactions = JSON.parse(
        JSON.stringify(state.pending_transactions),
      );
      state.pending_transactions = oldTransactions.filter(
        transaction =>
          transaction.hash.toLowerCase() !== action.payload.toLowerCase(),
      );
    },
    removePendingTransactions: (state, action) => {
      state.pending_transactions = [];
    },
    setLimitOrders: (state, action) => {
      state.limit_orders = action.payload;
    },
    setFarmRewards: (state, action) => {
      state.farm_rewards = action.payload;
    },
    setTrackedTokens: (state, action) => {
      state.tracked_tokens = action.payload;
    },
    setNewTrackedToken: (state, action) => {
      if (state.tracked_tokens) {
        let addToken = true;
        const newToken = action.payload;

        state.tracked_tokens.forEach(token => {
          if (`${token.address}` === `${newToken.address}`) {
            addToken = false;
          }
        });

        if (addToken) {
          state.tracked_tokens.push(action.payload);
        }
      } else {
        state.tracked_tokens = [action.payload];
      }
    },
    setBalanceUpdates: (state, action) => {
      state.balance_updates = action.payload;
    },
    setNewBalanceUpdates: (state, action) => {
      const newUpdate = action.payload;

      if (state.balance_updates) {
        const copy = JSON.parse(JSON.stringify(state.balance_updates));
        let addUpdate = true;
        let replacement = false;

        state.balance_updates.forEach((update, index) => {
          // We don't add queue objects with same id
          if (!newUpdate.id || `${update.id}` === `${newUpdate.id}`) {
            addUpdate = false;
          }

          // We don't add to queue objects with the same type
          if (!newUpdate.type) {
            addUpdate = false;
          }

          if (newUpdate.type && `${update.type}` === `${newUpdate.type}`) {
            addUpdate = false;

            if (
              newUpdate.block &&
              update.block &&
              `${newUpdate.origin}` === `${update.origin}` &&
              newUpdate.block > update.block
            ) {
              copy[index] = newUpdate;
              replacement = true;
            }
          }

          // If there's already an initial or block update (all data refreshes) in the queue, we don't need to add a new one
          if (
            ['initial', 'block'].includes(`${newUpdate.type}`) &&
            ['initial', 'block'].includes(update.type)
          ) {
            addUpdate = false;
          }
        });

        if (addUpdate) {
          state.balance_updates.push(newUpdate);
        }

        if (replacement) {
          state.balance_updates = copy;
        }
      } else {
        state.balance_updates = [newUpdate];
      }
    },
    setHistoricalPortfolioValue(state, action) {
      state.historical_portfolio_value = action.payload;
    },
    setLendAndBorrowData(state, action) {
      state.lendAndBorrowData = action.payload;
    },
    resetUserStatistics: state => {
      state.spirit_balance = 0;
      state.sob_liquidity_wallet = [];
      state.weighted_liquidity_wallet = [];
      state.farms_staked = {};
      state.tokens_value = 0;
      state.wallet = [];
      state.liquidity_value = 0;
      state.staked_value = 0;
      state.portfolio_value = 0;
      state.portfolio_percent_value = 0;
      state.inspirit_locked_amount = '0';
      state.inspirit_locked_end_date = 0;
      state.inspirit_balance = '0';
      state.spirit_claimable_amount = '0';
      state.bribes_claimable_amount = undefined;
      state.boosted_farm_votes = [];
      state.address = '';
      state.inspirit_allowance = 0;
      state.pending_transactions = [];
      state.liquidity_wallet = [];
      state.limit_orders = [];
      state.tracked_tokens = [];
      state.bridge_chains = [];
      state.bridge_wallet_from = [];
      state.bridge_wallet_to = [];
      state.balance_updates = [];
      state.farm_rewards = null;
      state.limitOrdersTotalValue = 0;
      state.historical_portfolio_value = {};
      state.tokens = {
        tokenList: [],
        diffAmount: '0',
        diffAmountValue: 0,
        diffPercent: '0',
        diffPercentValue: 0,
        totalValue: '0',
        total24Value: '0',
        totalValueNumber: 0,
        total24ValueNumber: 0,
      };
      state.liquidity = {
        farmList: [],
        diffAmount: '0',
        diffAmountValue: 0,
        diffPercent: '0',
        diffPercentValue: 0,
        totalValue: '0',
        total24Value: '0',
        totalValueNumber: 0,
        total24ValueNumber: 0,
      };
    },
  },
});

// Actions
export const {
  setAddress,
  setTokens,
  setLiquidity,
  setFarmsStaked,
  addNewLiquidity,
  setTokensValue,
  setLiquidityValue,
  setStakedValue,
  setPortfolioValue,
  setPortfolioPercentValue,
  setLockedInSpiritAmount,
  setLockedInSpiritEndDate,
  setInspiritUserBalance,
  setSpiritClaimableAmount,
  setBribesClaimableAmount,
  setBoostedFarmVotes,
  setSpiritBalance,
  setUserWallet,
  setBridgeChains,
  setBridgeWalletFrom,
  setBridgeWalletTo,
  resetUserStatistics,
  setInspiritAllowance,
  setPendingTransactions,
  setNewPendingTransactions,
  removePendingTransactions,
  removePendingTransaction,
  setUserLiquidityWallet,
  setUserSobLiquidityWallet,
  setUserWeightedLiquidityWallet,
  setLimitOrders,
  setFarmRewards,
  setTrackedTokens,
  setNewTrackedToken,
  setShowPortfolio,
  setBalanceUpdates,
  setNewBalanceUpdates,
  setHistoricalPortfolioValue,
  setLendAndBorrowData,
  setLimitOrdersValue,
} = userReducer.actions;

export default userReducer.reducer;
