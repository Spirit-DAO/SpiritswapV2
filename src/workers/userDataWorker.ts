import { CHAIN_ID, FTM } from 'constants/index';
import addresses from 'constants/contracts';
import {
  getBoostedFarmVotes,
  getFarmStakes,
  getGaugeBasicInfo,
  getHistoricalPortfolioValue,
  getIndividualLpBalance,
  getMappedTokens,
  getPendingRewards,
  getStakedBalances,
  getTokenGroupStatistics,
  getUserBalances,
  getUserInspiritBalances,
  saturateGauges,
} from 'utils/data';
import { getLimitOrders } from 'utils/swap/gelato';
import { checkSpiritAllowance, formatFrom } from 'utils/web3';
import { UNIDEX_ETH_ADDRESS } from 'utils/swap';
import { formatUnits } from 'ethers/lib/utils';
import { getRoundedSFs } from 'app/utils';
import { LendAndBorrowItem } from 'app/pages/Portfolio/components/LendAndBorrowPanel/LendAndBorrowPanel.d';
import { getOlaFinanceData } from 'utils/web3/actions/lendandborrow';
import { getPricesByPools } from 'utils/apollo/queries';

onmessage = ({ data: { type, provider, userAddress, signer, params } }) => {
  const loadedProvider = JSON.parse(provider);
  if (!loadedProvider._network) {
    loadedProvider._network = {
      chainId: CHAIN_ID,
    };
  }

  switch (type) {
    case 'updatePortfolioData':
      updatePortfolioData(userAddress, loadedProvider);
      break;
    case 'checkLimitOrders':
      checkLimitOrders(userAddress, JSON.parse(signer));
      break;
    case 'checkAllowances':
      checkAllowances(userAddress, loadedProvider);
      break;
    case 'fetchIndividualLP':
      fetchIndividualLP(userAddress, params, loadedProvider);
      break;
  }
};

const getStakedBalance = async (
  userWalletAddress,
  covalentRawDataPromise,
  provider,
) => {
  const stakesPromise = new Promise(async resolve => {
    const { walletLiquidityArray } = await getStakedBalances(
      userWalletAddress,
      covalentRawDataPromise,
      provider,
    );

    self.postMessage({
      type: 'setLiquidityWallet',
      payload: walletLiquidityArray,
      userWalletAddress,
    });

    resolve('');
  });

  const farmsPromise = new Promise(async resolve => {
    const { liquidity, farmLiquidityArray } = await getFarmStakes(
      userWalletAddress,
      provider,
    );
    self.postMessage({
      type: 'setLiquidity',
      payload: {
        liquidity,
        farmLiquidityArray,
      },
      userWalletAddress,
    });
    resolve('');
  });

  await Promise.all([stakesPromise, farmsPromise]);
};

/**
 * Helper method - Updates portfolio related data
 *  - userWalletAddress: Address of user in the blockchain
 *  - dispatch: callback hook method that allows update of app state
 */
const updatePortfolioData = async (userWalletAddress, provider) => {
  if (userWalletAddress) {
    const covalentRawDataPromise = getUserBalances(userWalletAddress);

    getStakedBalance(userWalletAddress, covalentRawDataPromise, provider);

    const gaugesPromise = getGaugeBasicInfo(provider);
    const stakesAndLiquidity = async () => {
      const covalentData = await covalentRawDataPromise;

      if (!covalentData) return;

      const items = await Promise.all(
        covalentData.items.map(async item => {
          let rate = item.quote_rate;
          let quote = item.quote;

          if (!rate || !quote) {
            rate = await getPricesByPools(item.contract_address);

            quote =
              rate *
              parseFloat(
                formatFrom(item?.balance || 0, item?.contract_decimals),
              );
          }

          return {
            ...item,
            quote_rate: rate,
            quote,
          };
        }),
      );

      const tokens = getTokenGroupStatistics(items, 'tokenList');

      self.postMessage({
        type: 'setTokens',
        payload: {
          tokens,
          wallet: tokens.tokenList,
        },
        userWalletAddress,
      });

      let spiritData;

      if (tokens.tokenList) {
        for (let i = 0; i < tokens.tokenList.length; i++) {
          const token = tokens.tokenList[i];
          if (token.symbol === 'SPIRIT') spiritData = token;
        }

        if (spiritData) {
          self.postMessage({
            type: 'setSpiritBalance',
            payload: parseFloat(`${spiritData?.amount || 0}`),
            userWalletAddress,
          });
        }
      }
    };

    const inSpiritData = async () => {
      saturateGauges(gaugesPromise, userWalletAddress).then(data => {
        self.postMessage({
          type: 'setSaturatedGauges',
          payload: data,
          userWalletAddress,
        });
      });

      const [inspiritUserStatistics, boostedFarmVotes] = await Promise.all([
        getUserInspiritBalances(userWalletAddress),
        getBoostedFarmVotes({ userAddress: userWalletAddress }),
      ]);

      self.postMessage({
        type: 'setInspiritData',
        payload: {
          inspiritUserStatistics,
          lockDate: parseInt(inspiritUserStatistics.userLockEndDate.toString()),
          boostedFarmVotes,
        },
        userWalletAddress,
      });
    };

    const getHistoricalData = async () => {
      const historicalPortfolioValue = await getHistoricalPortfolioValue(
        userWalletAddress,
      );

      self.postMessage({
        type: 'setHistoricalPortfolioValue',
        payload: historicalPortfolioValue,
        userWalletAddress,
      });
    };

    const getLendAndBorrowData = async () => {
      const suppliedTokens: LendAndBorrowItem[] = [];
      const borrowedTokens: LendAndBorrowItem[] = [];

      const { lendAndBorrowData, borrowAPYValues, supplyAPYValues } =
        await getOlaFinanceData(userWalletAddress);

      const mappedTokens = await getMappedTokens('address');

      lendAndBorrowData.forEach(data => {
        const addressUnderlying =
          data.underlying === UNIDEX_ETH_ADDRESS
            ? FTM.address
            : data.underlying;

        const { symbol } = mappedTokens[addressUnderlying.toLowerCase()] || {
          symbol: '',
        };
        const decimalsToFormat = 18;

        // Borrow
        if (parseFloat(data.borrowBalanceInUsd) > 0) {
          const borrowBalance = formatUnits(
            data.borrowBalanceInUnits.toString(),
            decimalsToFormat,
          ).toString();

          const borrowBalanceUSD = formatUnits(
            data.borrowBalanceInUsd.toString(),
            decimalsToFormat,
          ).toString();

          borrowedTokens.push({
            symbol: symbol,
            apy: borrowAPYValues[data.oToken],
            amountInUSD: parseFloat(borrowBalanceUSD).toFixed(2),
            amount: getRoundedSFs(borrowBalance),
          });
        }

        // Supply
        if (parseFloat(data.supplyBalanceInUsd) > 0) {
          const supplyBalance = formatUnits(
            data.supplyBalanceInUnits.toString(),
            decimalsToFormat,
          ).toString();

          const supplyBalanceUSD = formatUnits(
            data.supplyBalanceInUsd.toString(),
            decimalsToFormat,
          ).toString();

          suppliedTokens.push({
            symbol: symbol,
            apy: supplyAPYValues[data.oToken],
            amount: getRoundedSFs(supplyBalance),
            amountInUSD: parseFloat(supplyBalanceUSD).toFixed(2),
          });
        }
      });

      self.postMessage({
        type: 'setLendAndBorrowData',
        payload: { suppliedTokens, borrowedTokens },
        userWalletAddress,
      });
    };

    /**
     * Helper method - Checks user rewards
     *  - userWalletAddress: Address of user in the blockchain
     *  - dispatch: callback hook method that allows update of app state
     */
    const checkRewards = async () => {
      const gaugeData = await gaugesPromise;
      const results = await getPendingRewards(
        userWalletAddress,
        gaugeData,
        provider,
      );

      self.postMessage({
        type: 'setFarmRewards',
        payload: results,
        userWalletAddress,
      });
    };

    await Promise.all([
      stakesAndLiquidity(),
      inSpiritData(),
      getHistoricalData(),
      getLendAndBorrowData(),
      checkRewards(),
    ]);
  }
};

/**
 * Helper method - Checks for existing limit orders associated with the user in gelato
 *  - userWalletAddress: Address of user in the blockchain
 *  - dispatch: callback hook method that allows update of app state
 */
const checkLimitOrders = async (userWalletAddress, signer) => {
  // Checks if allowance exists for
  const limitOrders = await getLimitOrders(
    userWalletAddress,
    undefined,
    undefined,
    signer,
  );

  self.postMessage({
    type: 'setLimitOrders',
    payload: limitOrders,
    userWalletAddress,
  });
};

/**
 * Helper method - Updates allowance related data
 *  - userWalletAddress: Address of user in the blockchain
 *  - dispatch: callback hook method that allows update of app state
 */
const checkAllowances = async (userWalletAddress, provider) => {
  // Checks if allowance exists for
  const inspiritAllowance = await checkSpiritAllowance(
    userWalletAddress,
    addresses.inspirit[CHAIN_ID],
    undefined,
    provider,
  );

  self.postMessage({
    type: 'setInspiritAllowance',
    payload: inspiritAllowance,
    userWalletAddress,
  });
};

const fetchIndividualLP = async (userWalletAddress, params, provider) => {
  const { token0, token1, stable } = params;

  const data = await getIndividualLpBalance(
    userWalletAddress,
    token0,
    token1,
    stable,
    getMappedTokens,
    provider,
  );

  self.postMessage({
    type: 'setIndividualLP',
    payload: data,
    userWalletAddress,
  });
};
