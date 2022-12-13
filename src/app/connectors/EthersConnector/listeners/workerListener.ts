import { checkAddress } from 'app/utils';
import { store } from 'store';
import { setEcosystemFarms, setFarmMasterData } from 'store/farms';
import {
  setSpiritWarsData,
  setSpiritWarsStatistics,
  setFtmInfo,
  setAprPercentage,
  setAverageSpiritUnlockTime,
  setInSpiritPerSpirit,
  setLastSpiritDistribution,
  setLastSpiritDistributionValue,
  setNextSpiritDistribution,
  setSpiritInfo,
  setSpiritSupply,
  setSpiritValue,
  setStatisticsFrom,
  setTotalSpiritLocked,
  setTotalSpiritLockedValue,
  setMarketCap,
  setTVL,
  setLpPrices,
  setSaturatedGauges,
  setSpiritPerBlock,
} from 'store/general';
import {
  addNewLiquidity,
  setBoostedFarmVotes,
  setBribesClaimableAmount,
  setFarmRewards,
  setFarmsStaked,
  setHistoricalPortfolioValue,
  setInspiritAllowance,
  setInspiritUserBalance,
  setLendAndBorrowData,
  setLimitOrders,
  setLiquidity,
  setLockedInSpiritAmount,
  setLockedInSpiritEndDate,
  setSpiritBalance,
  setSpiritClaimableAmount,
  setTokens,
  setUserLiquidityWallet,
  setUserSobLiquidityWallet,
  setUserWallet,
  setUserWeightedLiquidityWallet,
} from 'store/user';
import { formatFrom } from 'utils/web3';

export const listenToAppWorker = (
  worker: Worker,
  dispatch,
  isLoggedIn: boolean,
) => {
  return (worker.onmessage = event => {
    const type = event.data.type;
    const payload = event.data.payload;
    switch (type) {
      case 'setEcosystemFarms':
        dispatch(setEcosystemFarms(payload));
        break;
      case 'setFarmMasterData':
        dispatch(setFarmMasterData(JSON.parse(payload)));
        break;
      case 'setSpiritWarsStatistics':
        dispatch(setSpiritWarsStatistics(payload));
        break;
      case 'setSpiritWarsData':
        dispatch(setSpiritWarsData(payload));
        break;
      case 'setLpPrices':
        dispatch(setLpPrices(JSON.parse(payload)));
        break;
      case 'setSpiritStatistics':
        dispatch(setFtmInfo(payload.ftmInfo));
        dispatch(setMarketCap(payload.marketCap));
        dispatch(setTVL(payload.tvl));
        dispatch(setSpiritInfo(payload.spiritInfo));
        dispatch(setAverageSpiritUnlockTime(payload.avgTime));
        dispatch(setLastSpiritDistribution(payload.lastDistribution));
        dispatch(setLastSpiritDistributionValue(payload.lastDistributionValue));
        dispatch(setNextSpiritDistribution(payload.nextDistribution));
        dispatch(setTotalSpiritLocked(payload.totalLocked));
        dispatch(setTotalSpiritLockedValue(payload.totalLockedValue));
        dispatch(setSpiritValue(payload.totalSpiritValue));
        dispatch(setSpiritSupply(payload.totalSupply));
        dispatch(setAprPercentage(payload.aprLDbased));
        dispatch(setStatisticsFrom(payload.beginningPeriod));
        dispatch(setInSpiritPerSpirit(payload.inspiritPerSpirit));
        dispatch(setSpiritPerBlock(payload.spiritperblock));
        break;
      case 'setSaturatedGauges':
        if (!isLoggedIn) break;
        dispatch(setSaturatedGauges(payload));
        break;
    }
  });
};

export const listenToUserworker = (worker: Worker, dispatch) => {
  return (worker.onmessage = event => {
    const type = event.data.type;
    const payload = event.data.payload;
    const userAddress = event.data.userWalletAddress;

    // Ensure the wallet we got data for is the one we want!
    // This handles a user switching wallets mid data update
    if (!validateWallet(userAddress)) {
      return;
    }

    switch (type) {
      case 'setHistoricalPortfolioValue':
        dispatch(setHistoricalPortfolioValue(payload));
        break;
      case 'setTokens':
        dispatch(setTokens(payload.tokens));
        dispatch(setUserWallet(payload.wallet));
        break;
      case 'setBribes':
        dispatch(setBribesClaimableAmount(payload));
        break;
      case 'setCovalentData':
        dispatch(setUserSobLiquidityWallet(payload.sobLiquidity));
        dispatch(setUserWeightedLiquidityWallet(payload.weightedLiquidity));
        break;
      case 'setSpiritBalance':
        dispatch(setSpiritBalance(payload));
        break;
      case 'setLiquidity':
        dispatch(setLiquidity(payload.liquidity));
        dispatch(setFarmsStaked(payload.farmLiquidityArray));
        break;
      case 'setLiquidityWallet':
        dispatch(setUserLiquidityWallet(payload));
        break;
      case 'setUserLiquidityWallet':
        dispatch(setUserLiquidityWallet(payload));
        break;
      case 'setSaturatedGauges':
        dispatch(setSaturatedGauges(payload));
        break;
      case 'setFarmRewards':
        dispatch(setFarmRewards(payload));
        break;
      case 'setInspiritData':
        const { inspiritUserStatistics, boostedFarmVotes, lockDate } = payload;
        dispatch(setInspiritUserBalance(inspiritUserStatistics.userBalance));
        dispatch(setLockedInSpiritAmount(inspiritUserStatistics.userLocked));
        dispatch(
          setSpiritClaimableAmount(inspiritUserStatistics.userClaimableAmount),
        );
        dispatch(setLockedInSpiritEndDate(lockDate));
        dispatch(setBoostedFarmVotes(boostedFarmVotes));
        break;
      case 'setIndividualLP':
        dispatch(addNewLiquidity(payload));
        break;
      case 'setLimitOrders':
        dispatch(setLimitOrders(payload));
        break;
      case 'setInspiritAllowance':
        dispatch(setInspiritAllowance(parseFloat(formatFrom(payload))));
        break;
      case 'setLendAndBorrowData':
        dispatch(setLendAndBorrowData(payload));
        break;
    }
  });
};

const validateWallet = address => {
  // Get the current wallet address
  return checkAddress(address, store.getState().user.address);
};
