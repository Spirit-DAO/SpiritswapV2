import { createSlice } from '@reduxjs/toolkit';
import { Token, UserCustomToken } from 'app/interfaces/General';
import { StatisticsProps } from 'app/pages/SpiritWars/components/Statistics';

const initialState: {
  spiritInfo: {
    price: number;
    percentajeChange24: number;
  };
  ftmInfo: {
    price: number;
    percentajeChange24: number;
  };
  marketCap: number;
  tvl: number;
  liquidity_pools: Array<any>;
  saturated_gauges: Array<any>;
  total_spirit_supply: string;
  total_spirit_value: number;
  average_spirit_unluck_time: string;
  last_spirit_distribution: string;
  last_spirit_distribution_value: 0;
  next_spirit_distribution: '';
  total_spirit_locked: number;
  total_spirit_locked_value: number;
  apr_percentage: number;
  statistics_from: number;
  inspirit_per_spirit: number;
  userCustomTokens: UserCustomToken[];
  isHomePage: boolean;
  tokensToShow: string;
  swapModeIndex: number;
  spiritWarsStatistics: StatisticsProps;
  spiritWarsData: Token[];
  lp_prices: {};
  spiritperblock: number;
  spiritssupply: number;
} = {
  spiritInfo: {
    price: 0,
    percentajeChange24: 0,
  },
  ftmInfo: {
    price: 0,
    percentajeChange24: 0,
  },
  marketCap: 0,
  tvl: 0,
  liquidity_pools: [],
  saturated_gauges: [],
  total_spirit_supply: '',
  total_spirit_value: 0,
  average_spirit_unluck_time: '0',
  last_spirit_distribution: '',
  last_spirit_distribution_value: 0,
  next_spirit_distribution: '',
  total_spirit_locked: 0,
  total_spirit_locked_value: 0,
  apr_percentage: 0,
  inspirit_per_spirit: 0,
  statistics_from: Date.now(),
  userCustomTokens: [],
  isHomePage: false,
  tokensToShow: '',
  swapModeIndex: 0,
  spiritWarsStatistics: {},
  spiritWarsData: [],
  lp_prices: {},
  spiritperblock: 0,
  spiritssupply: 0,
};

export const generalReducer = createSlice({
  name: 'generalReducer',
  initialState,
  reducers: {
    setFtmInfo: (state, action) => {
      state.ftmInfo = action.payload;
    },
    setMarketCap: (state, action) => {
      state.marketCap = action.payload;
    },
    setTVL: (state, action) => {
      state.tvl = action.payload;
    },
    setSpiritInfo: (state, action) => {
      state.spiritInfo = action.payload;
    },
    setLiquidityPools: (state, action) => {
      state.liquidity_pools = action.payload;
    },
    setSpiritSupply: (state, action) => {
      state.total_spirit_supply = action.payload;
    },
    setSpiritValue: (state, action) => {
      state.total_spirit_value = action.payload;
    },
    setAverageSpiritUnlockTime: (state, action) => {
      state.average_spirit_unluck_time = action.payload;
    },
    setLastSpiritDistribution: (state, action) => {
      state.last_spirit_distribution = action.payload;
    },
    setLastSpiritDistributionValue: (state, action) => {
      state.last_spirit_distribution_value = action.payload;
    },
    setNextSpiritDistribution: (state, action) => {
      state.next_spirit_distribution = action.payload;
    },
    setTotalSpiritLocked: (state, action) => {
      state.total_spirit_locked = action.payload;
    },
    setTotalSpiritLockedValue: (state, action) => {
      state.total_spirit_locked_value = action.payload;
    },
    setAprPercentage: (state, action) => {
      state.apr_percentage = action.payload;
    },
    setStatisticsFrom: (state, action) => {
      state.statistics_from = action.payload;
    },
    setInSpiritPerSpirit: (state, action) => {
      state.inspirit_per_spirit = action.payload;
    },
    setSaturatedGauges: (state, action) => {
      state.saturated_gauges = action.payload;
    },
    setUserCustomTokens: (state, action) => {
      state.userCustomTokens = [...state.userCustomTokens, action.payload];
    },
    removeUserCustomToken: (state, action) => {
      state.userCustomTokens = state.userCustomTokens?.filter(
        token => token.address !== action.payload,
      );
    },
    setIsHomePage: (state, action) => {
      state.isHomePage = action.payload;
    },
    setTokensToShow: (state, action) => {
      state.tokensToShow = action.payload;
    },
    setGlobalSwapModeIndex: (state, action) => {
      state.swapModeIndex = action.payload;
    },
    setSpiritWarsStatistics: (state, action) => {
      state.spiritWarsStatistics = action.payload;
    },
    setSpiritWarsData: (state, action) => {
      state.spiritWarsData = action.payload;
    },
    setLpPrices: (state, action) => {
      state.lp_prices = action.payload;
    },
    setSpiritPerBlock: (state, action) => {
      state.spiritperblock = action.payload;
    },
    setSpiritTotalSupply: (state, action) => {
      state.spiritssupply = action.payload;
    },
  },
});

// Actions
export const {
  setSpiritInfo,
  setLiquidityPools,
  setSpiritSupply,
  setSpiritValue,
  setAverageSpiritUnlockTime,
  setLastSpiritDistribution,
  setLastSpiritDistributionValue,
  setNextSpiritDistribution,
  setTotalSpiritLocked,
  setTotalSpiritLockedValue,
  setAprPercentage,
  setStatisticsFrom,
  setInSpiritPerSpirit,
  setSaturatedGauges,
  setUserCustomTokens,
  setIsHomePage,
  removeUserCustomToken,
  setTokensToShow,
  setGlobalSwapModeIndex,
  setSpiritWarsStatistics,
  setSpiritWarsData,
  setMarketCap,
  setTVL,
  setFtmInfo,
  setLpPrices,
  setSpiritPerBlock,
  setSpiritTotalSupply,
} = generalReducer.actions;

export default generalReducer.reducer;
