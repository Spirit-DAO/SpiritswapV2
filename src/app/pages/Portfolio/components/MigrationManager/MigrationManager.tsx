import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TransactionFlow } from 'app/components/TransactionFlow';
import { Token, TokenAmount } from 'app/interfaces/General';
import { CHAIN_ID } from 'constants/index';
import { useDisclosure } from '@chakra-ui/react';
import {
  pairTradingData,
  getLiquidityData,
  AddLiquidityTrade,
  checkLpPairCreated,
} from 'utils/web3/actions/liquidity';
import {
  buildCheckAndApprove,
  buildAddLiquidity,
  buildRemoveLiquidity,
  buildExitFromFarm,
  buildEnterOnFarm,
} from 'app/components/TransactionFlow/utils/helper';
import contracts from 'constants/contracts';
import { farmsRouterV2 } from 'constants/farms/index';
import { formatUnits } from 'ethers/lib/utils';
import { getPooledData } from 'utils/web3';
import { getFarmFromLp, GetVerifiedTokenFromAddres } from 'app/utils/methods';
import { Props } from './MigrationManager.d';
import { FarmConfig } from 'constants/types';
import useWallets from 'app/hooks/useWallets';
import useSettings from 'app/hooks/useSettings';
import useGetGasPrice from 'app/hooks/useGetGasPrice';

const MigrationManagerMemo = ({
  farmDataArray,
  isFarm,
  isOpen,
  setOpen,
}: Props) => {
  const { t } = useTranslation();
  const { account } = useWallets();
  const { onClose } = useDisclosure();
  const [arrayOfSteps, setArrayOfSteps] = useState<any>([]);
  const [steps, setSteps] = useState<any>([]);
  const currentMigration = useRef(0);
  const { states } = useSettings();
  const { gasPrice } = useGetGasPrice({ speed: states.txSpeed });
  const ROUTER_ADDRESS = contracts.router[CHAIN_ID];
  const ROUTER_V2_ADDRESS = contracts.routerV2[CHAIN_ID];

  const headingText = isFarm
    ? t('portfolio.migrate.headingFarms')
    : t('portfolio.migrate.headingLPs');

  const descriptionText = t('portfolio.migrate.description');
  const generalText = t('portfolio.migrate.confirmAllTransactions');

  const leftText = isFarm
    ? t('portfolio.migrate.farmsLeft')
    : t('portfolio.migrate.lpsLeft');

  const getPooledFarmData = async (
    lpTokenWAmount: TokenAmount,
    isFarm: boolean,
  ) => {
    if (isFarm) {
      const verifiedFarm = getFarmFromLp(lpTokenWAmount.token.address);
      if (verifiedFarm) {
        const pooledData = await getPooledData(
          lpTokenWAmount.token.address,
          lpTokenWAmount.amount.toString(),
        );
        if (pooledData) {
          const t0 = GetVerifiedTokenFromAddres(pooledData.token0);
          const t1 = GetVerifiedTokenFromAddres(pooledData.token1);

          const tokenWAmount0 = {
            token: t0,
            amount: pooledData.pooled0.toString(),
          };
          const tokenWAmount1 = {
            token: t1,
            amount: pooledData.pooled1.toString(),
          };
          const farmExtraData = {
            tokenWAmount0,
            tokenWAmount1,
            pid: verifiedFarm?.pid,
            farmAddress: verifiedFarm?.gaugeAddress,
            isGauge: verifiedFarm?.isGauge,
          };
          return farmExtraData;
        }
      }
    }
    return false;
  };

  const getTradeData = async (tokenWA0: TokenAmount, tokenWA1: TokenAmount) => {
    let params = {
      sellToken: tokenWA0.token,
      buyToken: tokenWA1.token,
      sellAmount: tokenWA0.amount,
      buyAmount: '0',
      pairAddress: '',
    };

    if (
      tokenWA0.token &&
      tokenWA0.token.address &&
      tokenWA1.token &&
      tokenWA1.token.address
    ) {
      const { pairAddress, lpSymbol } = await checkLpPairCreated({
        tokenA: params.sellToken,
        tokenB: params.buyToken,
      });
      params.pairAddress = pairAddress;

      const response = await pairTradingData(params);
      const tx = response.tx;
      const pairData = response.pairData;
      const slippage = 80;

      if (tx && tx.buyAmount && tx.sellAmount) {
        const liquidityData = await getLiquidityData(
          pairData,
          pairAddress,
          lpSymbol,
          tokenWA0.token,
          tokenWA1.token,
          `${formatUnits(tx.sellAmount, tokenWA0.token.decimals) || 0}`,
          `${formatUnits(tx.buyAmount, tokenWA1.token.decimals) || 0}`,
          '0',
          '0',
          `${gasPrice}`,
          slippage,
          CHAIN_ID,
          true,
        );
        return liquidityData;
      }
    }
    return undefined;
  };

  const getDestinyFarm = (v1Pid: number) => {
    if (!v1Pid) {
      return;
    }
    return farmsRouterV2.find(farm => farm.v1Pid === v1Pid);
  };

  const initialMigrateSteps = useCallback(
    async (
      lpTokenAmount: TokenAmount,
      isFarm: boolean,
      tokenAmount0: TokenAmount,
      tokenAmount1: TokenAmount,
      farmData: FarmConfig,
    ) => {
      const farmExtraData = await getPooledFarmData(lpTokenAmount, isFarm);

      let tokenWAmount0 = tokenAmount0;
      let tokenWAmount1 = tokenAmount1;
      let preSteps;
      let inSteps;
      let postSteps;
      if (isFarm && farmExtraData) {
        tokenWAmount0 = farmExtraData.tokenWAmount0;
        tokenWAmount1 = farmExtraData.tokenWAmount1;
        const extraFarmData = {
          ...farmData,
          gaugeAddress: farmExtraData.farmAddress,
          isGauge: farmExtraData.isGauge,
          token0: tokenWAmount0.token,
          pooled0: tokenWAmount0.amount,
          token1: tokenWAmount1.token,
          pooled1: tokenWAmount1.amount,
        };
        const destinyFarm = getDestinyFarm(farmExtraData.pid);

        if (destinyFarm?.gaugeAddress) {
          const lpTokenAmountV2 = {
            token: {
              ...lpTokenAmount.token,
              address: destinyFarm?.lpAddresses[CHAIN_ID],
            },
            amount: lpTokenAmount.amount,
          };
          preSteps = [buildExitFromFarm(1, extraFarmData, lpTokenAmount)];
          postSteps = [
            buildCheckAndApprove(
              2,
              account,
              lpTokenAmountV2,
              destinyFarm?.gaugeAddress,
            ),
            buildEnterOnFarm(8, destinyFarm?.gaugeAddress, lpTokenAmountV2),
          ];
        }
      }
      const tradeData: AddLiquidityTrade | undefined = await getTradeData(
        tokenWAmount0,
        tokenWAmount1,
      );

      if (tradeData) {
        inSteps = [
          ...(preSteps ?? []),
          buildCheckAndApprove(3, account, lpTokenAmount, ROUTER_ADDRESS),
          buildRemoveLiquidity(4, account, lpTokenAmount),
          buildCheckAndApprove(5, account, tokenWAmount0, ROUTER_V2_ADDRESS),
          buildCheckAndApprove(6, account, tokenWAmount1, ROUTER_V2_ADDRESS),
          buildAddLiquidity(7, account, tradeData, true),
          ...(postSteps ?? []),
        ];
      }

      if (inSteps !== undefined) {
        return inSteps;
      }
    },
    [ROUTER_ADDRESS, ROUTER_V2_ADDRESS, account],
  );

  const createMigrationSetSteps = useCallback(async () => {
    const promises: Promise<any>[] = [];
    if (farmDataArray.length > 0) {
      farmDataArray.forEach(farmData => {
        if (farmData) {
          let {
            name: tokenName,
            address: tokenAddress,
            amount: tokenAmount,
            pooled0,
            pooled1,
            token0,
            token1,
          } = farmData;

          const isFarm = !farmData.staked;
          const isV1 = !farmData.isRouterV2;
          if (isV1) {
            const tokenArray = Array.isArray(tokenName)
              ? tokenName
              : [tokenName];
            const tokenSymbol = tokenArray[0]
              ? tokenArray[0].replace(' LP', '').trimEnd()
              : '';

            const lpToken = {
              address: tokenAddress ?? '',
              symbol: tokenSymbol,
              name: tokenName,
              decimals: 18,
              chainId: CHAIN_ID,
            };

            const lpTokenAmount = {
              token: lpToken,
              amount: tokenAmount.toString(),
            };

            const tokenAmount0 = {
              token: token0 as Token,
              amount: pooled0 ? pooled0.toString() : '0',
            };

            const tokenAmount1 = {
              token: token1 as Token,
              amount: pooled1 ? pooled1.toString() : '0',
            };

            promises.push(
              initialMigrateSteps(
                lpTokenAmount,
                isFarm,
                tokenAmount0,
                tokenAmount1,
                farmData,
              ),
            );
          }
        }
      });
      if (promises.length > 0) {
        const details = await Promise.all(promises);
        let allSteps: Array<any> = [];
        details.forEach(steps => {
          if (steps !== undefined) {
            allSteps.push(steps);
          }
        });
        setArrayOfSteps(() => allSteps);
        setSteps(() => allSteps[0]);
      }
    }
  }, [farmDataArray, initialMigrateSteps]);

  useEffect(() => {
    if (isOpen) {
      createMigrationSetSteps();
    } else {
      setSteps([]);
    }
  }, [createMigrationSetSteps, isOpen]);

  const handleFinish = useCallback(() => {
    setSteps([]);
    setOpen(false);
  }, [setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose();
  }, [setOpen, onClose]);

  const handleNextMigration = useCallback(() => {
    currentMigration.current++;
    setSteps(() => arrayOfSteps[currentMigration.current]);
  }, [arrayOfSteps]);

  const hasNext = arrayOfSteps.length > currentMigration.current + 1;
  const migrationsLeft =
    arrayOfSteps.length > 1
      ? arrayOfSteps.length - (currentMigration.current + 1)
      : undefined;

  return steps ? (
    <TransactionFlow
      heading={headingText}
      description={descriptionText}
      generalText={generalText}
      leftText={leftText}
      arrayOfSteps={steps}
      handleFinish={handleFinish}
      onClose={handleClose}
      isOpen={isOpen}
      nextStep={handleNextMigration}
      hasNext={hasNext}
      stepsLeft={migrationsLeft}
    />
  ) : null;
};

const MigrationManager = React.memo(MigrationManagerMemo);
export default MigrationManager;
