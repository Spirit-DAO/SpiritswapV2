import { CHAIN_ID, SPIRITSWAP_UNITROLLER_OLA_FINANCE } from 'constants/index';
import contracts from 'constants/contracts';
import { Contract, Multicall } from '../contracts';
import BigNumber from 'bignumber.js';
import { formatUnits } from 'ethers/lib/utils';

const YEAR_IN_SECONDS = 31536000;
const COMPOUNDS_PER_YEAR = 365;

const getSupplyAPY = (
  borrowRate: BigNumber,
  totalBorrowedInUnits: BigNumber,
  reserveFactor: BigNumber,
  totalSupply: BigNumber,
) => {
  if (!borrowRate) return new BigNumber(0);

  const borrowApy = getBorrowAPY(borrowRate);
  const formatedReserveFactor = formatUnits(`${reserveFactor}`, 18);
  const formatedTotalSupply = formatUnits(`${totalSupply}`, 18);
  const formatedTotalBorrowed = formatUnits(`${totalBorrowedInUnits}`, 18);

  const paidInterest = borrowApy
    .multipliedBy(formatedTotalBorrowed)
    .multipliedBy(new BigNumber(1).minus(formatedReserveFactor));

  const supplyApy = paidInterest.dividedBy(formatedTotalSupply);
  return supplyApy.multipliedBy(100);
};

const getBorrowAPY = (borrowRate: BigNumber) => {
  if (!borrowRate) return new BigNumber(0);

  const formatedBorrowRate = formatUnits(borrowRate?.toString(), 18);

  const borrowApr = new BigNumber(formatedBorrowRate).multipliedBy(
    YEAR_IN_SECONDS,
  );
  const base = borrowApr.dividedBy(COMPOUNDS_PER_YEAR).plus(1);
  const powered = base.exponentiatedBy(COMPOUNDS_PER_YEAR);
  const final = powered.minus(1);
  return final;
};

export const getOlaFinanceData = async (userAddress: string) => {
  const contract = await Contract(
    contracts.olaLendingLend[CHAIN_ID],
    'lendAndBorrow',
  );

  const lendAndBorrowData = await contract.callStatic.viewMarketBalancesInLeN(
    SPIRITSWAP_UNITROLLER_OLA_FINANCE,
    userAddress,
  );

  const marketCallsArray = lendAndBorrowData.map(market => ({
    name: 'viewMarket',
    params: [market.oToken],
    address: contracts.olaLendingLend[CHAIN_ID],
  }));

  const rawMarkets = await Multicall(
    marketCallsArray,
    'lendAndBorrow',
    CHAIN_ID,
    'rpc',
  );

  const markets = rawMarkets.map((response, index) => ({
    oToken: lendAndBorrowData[index].oToken,
    data: response.response,
  }));

  const borrowAPYValues: { [oToken: string]: string } = {};
  const supplyAPYValues: { [oToken: string]: string } = {};

  lendAndBorrowData.forEach(market => {
    const marketInfo = markets.find(item => item.oToken === market.oToken);
    if (!marketInfo) throw new Error('MarketInfo not found');

    // Borrowed tokens
    if (parseFloat(market.borrowBalanceInUsd) > 0) {
      const borrowAPY = getBorrowAPY(marketInfo.data.borrowRate);

      borrowAPYValues[market.oToken] = `-${borrowAPY
        .multipliedBy(100)
        .toFixed(4)}%`;
    }

    // Supplied tokens
    if (parseFloat(market.supplyBalanceInUsd) > 0) {
      const { borrowRate, reserveFactor, supplyUnits, borrowsUnits } =
        marketInfo.data;

      const supplyAPY = getSupplyAPY(
        borrowRate,
        borrowsUnits,
        reserveFactor,
        supplyUnits,
      );

      supplyAPYValues[market.oToken] = `${supplyAPY.toFixed(4)}%`;
    }
  });

  return { lendAndBorrowData, borrowAPYValues, supplyAPYValues };
};
