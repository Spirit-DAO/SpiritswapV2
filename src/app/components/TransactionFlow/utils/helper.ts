import { TransactionStatus } from 'app/components/TransactionFlow';
import {
  depositAllGaugePoolToken,
  gaugeHarvest,
} from 'utils/web3/actions/farm';
import { BASE_TOKEN_ADDRESS } from 'constants/index';
import { FarmConfig } from 'constants/types';
import {
  checkAllowance,
  approve,
  removeWeightedLiquidity,
  transactionResponse,
} from 'utils/web3/actions';
import { Token, TokenAmount, WeightedTokenPool } from 'app/interfaces/General';
import {
  addLiquidity,
  AddLiquidityTrade,
  addWeightedLiquidity,
  AddLiquidityTradeV2,
  addSobLiquidity,
  removeLiquidity,
} from 'utils/web3/actions/liquidity';
import {
  unstakePoolToken,
  unstakeGaugePoolTokenAll,
} from 'utils/web3/actions/farm';
import { BigNumber, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { StepProps } from '../TransactionFlow.d';
import { FarmRewardInfo } from 'utils/data';
import { formatAmount, getRoundedSFs } from 'app/utils';

export const buildCheckAndApprove = (
  number: number,
  account: string,
  tokenAmount: TokenAmount,
  approveAddress: string,
  approveAll = true,
  isRemove = false,
): StepProps | {} => {
  if (!account || !tokenAmount || !approveAddress) {
    return {};
  }
  return {
    number,
    title: `Approve ${tokenAmount.token?.symbol}`,
    status: TransactionStatus.UPCOMING,
    fn: checkAndApproveTokenTF,
    params: {
      account: account,
      tokenAmount: tokenAmount,
      spender: approveAddress,
      approveAll,
      isRemove,
    },
  };
};

export const buildAddLiquidity = (
  number: number,
  account: string,
  liquidityTrade: AddLiquidityTrade | AddLiquidityTradeV2 | null,
  isV2?: boolean,
  type?: number, // classic: 0, stable: 1, weighted: 2
  isStable?: boolean,
): StepProps | {} => {
  let action: Function = addLiquidity;
  let params: any[] = [account, liquidityTrade, isV2, isStable];
  let title = 'Add liquidity';

  if (type === 1) {
    title = 'Receive stable pool tokens';
    action = addSobLiquidity;
    if (liquidityTrade) {
      params = Object.values(liquidityTrade);
    }
  }

  if (type === 2) {
    action = addWeightedLiquidity;
    if (liquidityTrade) {
      params = Object.values(liquidityTrade);
    }
  }

  return {
    number,
    title,
    status: TransactionStatus.UPCOMING,
    fn: addLiquidityTF,
    action,
    params,
    monitoring: true,
    type: 'liquidity',
  };
};

export const buildRemoveLiquidity = (
  number: number,
  account: string,
  lpTokenAmount: TokenAmount,
): StepProps | {} => {
  if (!account || !lpTokenAmount) {
    return {};
  }
  return {
    number,
    title: 'Remove liquidity',
    status: TransactionStatus.UPCOMING,
    fn: removeLiquidityTF,
    params: { account: account, lpTokenAmount: lpTokenAmount },
    monitoring: true,
  };
};

export const buildRemoveLiquidityV2 = (
  number: number,
  account: string,
  lpTokenAmount: TokenAmount,
  token0: Token,
  token1: Token,
  estimates?: any,
  type?: string,
  isV2: boolean = true,
  isStable: boolean = false,
): StepProps | {} => {
  if (!account || !lpTokenAmount) {
    return {};
  }

  return {
    number,
    title: 'Remove liquidity',
    status: TransactionStatus.UPCOMING,
    fn: removeLiquidityTF,
    params: {
      account: account,
      lpTokenAmount: lpTokenAmount,
      estimates,
      type,
      isV2,
      isStable,
      token0,
      token1,
    },
    monitoring: true,
  };
};

export const buildExitFromFarm = (
  number: number,
  farm: FarmConfig,
  lpTokenAmount: TokenAmount,
): StepProps | {} => {
  if (!farm || !lpTokenAmount) {
    return {};
  }
  return {
    number,
    title: 'Withdraw',
    status: TransactionStatus.UPCOMING,
    fn: exitFromFarmTF,
    params: { farm: farm, lpTokenAmount: lpTokenAmount },
    monitoring: true,
  };
};

export const buildEnterOnFarm = (
  number: number,
  gaugeAddress: string,
  lpTokenAmount: TokenAmount,
  type = 'gauge',
): StepProps | {} => {
  if (!gaugeAddress || !lpTokenAmount) {
    return {};
  }

  return {
    number,
    title: 'Deposit LP',
    status: TransactionStatus.UPCOMING,
    fn: enterOnFarmTF,
    params: { gaugeAddress, lpTokenAmount, type },
    monitoring: true,
  };
};

export const checkAndApproveTokenTF = async ({
  account,
  tokenAmount,
  spender,
  index,
  steps,
  setSteps,
  liquidityFunction,
  approveAll = true,
  isRemove = false,
  addToQueue,
}: {
  account: string;
  tokenAmount: TokenAmount;
  spender: string;
  index: number;
  addToQueue: Function;
  steps;
  isRemove?: boolean;
  setSteps;
  liquidityFunction: Function;
  approveAll: boolean;
}) => {
  const updateStep = (status: string) => {
    const newStep = [...steps];
    newStep[index].status = status;
    setSteps(newStep);
  };

  const isFantom = tokenAmount.token.address === BASE_TOKEN_ADDRESS;
  if (isFantom) return updateStep(TransactionStatus.SUCCESS);

  try {
    const amountBN = parseUnits(tokenAmount.amount, tokenAmount.token.decimals);

    const allowance: BigNumber = await checkAllowance(
      account,
      tokenAmount.token.address,
      spender,
    );
    if (amountBN.gt(allowance)) {
      updateStep(TransactionStatus.LOADING);

      const tx = await approve(
        tokenAmount.token.address,
        spender,
        approveAll ? ethers.constants.MaxUint256 : amountBN,
      );

      const response = transactionResponse(
        isRemove ? 'liquidity.removeApprove' : 'liquidity.approve',
        {
          operation: 'APPROVE',
          tx: tx,
          uniqueMessage: {
            text: 'Approving',
            secondText: tokenAmount.token.symbol,
          },
        },
      );

      addToQueue && addToQueue(response);

      await tx.wait();
      if (tx) {
        updateStep(TransactionStatus.SUCCESS);
      }
    } else {
      const newSteps = [...steps];
      newSteps[index].status = TransactionStatus.SUCCESS;
      setSteps(newSteps);
    }
  } catch (error) {
    updateStep(TransactionStatus.FAILED);
  }
};

export const addLiquidityTF = async ({
  account,
  liquidityTrade,
  isV2,
  index,
  steps,
  setSteps,
  params,
  action,
  notifications,
  suggestion,
  addToQueue,
  force,
}: {
  account: string;
  liquidityTrade: AddLiquidityTrade;
  isV2?: boolean;
  index: number;
  steps;
  params: any[];
  action: Function;
  notifications: boolean;
  suggestion: {
    type: string;
    id: string;
    data: {
      farmExist: boolean;
      lpAddress: string;
    };
  };
  addToQueue: Function;
  force: boolean;
  setSteps;
}) => {
  const updateStep = (status: string, txData?) => {
    const newStep = [...steps];
    newStep[index].status = status;
    if (txData) {
      newStep[index].tx = txData;
    }
    setSteps(newStep);
  };

  let liquidityFunction: Function = addLiquidity;
  let payload = [account, liquidityTrade];

  if (action) {
    liquidityFunction = action;
  }

  if (params) {
    payload = params;
  }

  try {
    if (!force) {
      updateStep(TransactionStatus.LOADING);
    }

    const response = await liquidityFunction(...payload);

    if (notifications && suggestion) {
      addToQueue(response, suggestion);
    }

    await response.tx.wait();
    if (response.tx) {
      updateStep(TransactionStatus.SUCCESS, response);
    }
  } catch (error) {
    updateStep(TransactionStatus.FAILED);
  }
};

export const removeLiquidityTF = async ({
  account,
  lpTokenAmount,
  index,
  steps,
  setSteps,
  notifications,
  addToQueue,
  force,
  isV2,
  isStable,
  estimates,
  token0,
  token1,
  type,
}: {
  account: string;
  lpTokenAmount: TokenAmount;
  index: number;
  notifications: boolean;
  addToQueue: Function;
  force: boolean;
  type: string;
  estimates;
  isV2: boolean;
  isStable: boolean;
  token0: Token;
  token1: Token;
  steps;
  setSteps;
}) => {
  const updateStep = (status: string, txData?) => {
    const newStep = [...steps];
    newStep[index].status = status;
    if (txData) {
      newStep[index].tx = txData;
    }
    setSteps(newStep);
  };

  try {
    if (!force) {
      updateStep(TransactionStatus.LOADING);
    }

    let response;
    const { token, amount } = lpTokenAmount;

    if (type === 'weighted') {
      response = await removeWeightedLiquidity(
        token as WeightedTokenPool,
        amount,
        estimates,
        account,
      );
    } else {
      response = await removeLiquidity(
        account,
        lpTokenAmount.token,
        token0,
        token1,
        lpTokenAmount.amount,
        isV2,
        isStable,
      );
    }

    if (notifications) {
      addToQueue(response);
    }

    await response.tx.wait();
    if (response.tx) {
      updateStep(TransactionStatus.SUCCESS, response);
    }
  } catch (error) {
    console.error('Error on remove Liquidity', error);
    updateStep(TransactionStatus.FAILED);
  }
};

export const exitFromFarmTF = async ({
  farm,
  lpTokenAmount,
  index,
  steps,
  setSteps,
}: {
  farm: FarmConfig;
  lpTokenAmount: TokenAmount;
  index: number;
  steps;
  setSteps;
}) => {
  const updateStep = (status: string) => {
    const newStep = [...steps];
    newStep[index].status = status;
    setSteps(newStep);
  };

  try {
    updateStep(TransactionStatus.LOADING);

    let tx;
    if (farm.isGauge && farm.gaugeAddress) {
      tx = await unstakeGaugePoolTokenAll(farm.gaugeAddress);
    } else {
      tx = await unstakePoolToken(farm.pid, lpTokenAmount.amount);
    }

    await tx.wait();
    if (tx) {
      updateStep(TransactionStatus.SUCCESS);
    }
  } catch (error) {
    updateStep(TransactionStatus.FAILED);
  }
};

export const enterOnFarmTF = async ({
  gaugeAddress,
  lpTokenAmount,
  index,
  steps,
  setSteps,
  type,
  addToQueue,
}: {
  gaugeAddress: string;
  lpTokenAmount: TokenAmount;
  index: number;
  steps;
  setSteps;
  type?: string;
  addToQueue?: Function;
}) => {
  const updateStep = (status: string) => {
    const newStep = [...steps];
    newStep[index].status = status;
    setSteps(newStep);
  };

  try {
    updateStep(TransactionStatus.LOADING);

    let tx;
    let amountToDeposit = lpTokenAmount.amount;

    const farm = lpTokenAmount.token as any;

    if (gaugeAddress) {
      tx = await depositAllGaugePoolToken(gaugeAddress);
      const response = transactionResponse('farm.deposit', {
        tx: tx,
        inputSymbol: `${farm.title} LP`,
        inputValue: amountToDeposit,
        operation: 'FARM',
        update: 'portfolio',
        updateTarget: 'user',
      });
      addToQueue && addToQueue(response);
    }
    await tx.wait();
    if (tx) {
      updateStep(TransactionStatus.SUCCESS);
    }
  } catch (error) {
    updateStep(TransactionStatus.FAILED);
  }
};

export const claimRewards = async ({
  farm,
  addToQueue,
}: {
  farm: FarmRewardInfo;
  addToQueue: any;
}) => {
  let tx;
  try {
    if (farm.gaugeAddress) {
      tx = await gaugeHarvest(farm.gaugeAddress);
    }

    const response = transactionResponse('farm.claim', {
      tx: tx,
      uniqueMessage: {
        text: `Claiming ${getRoundedSFs(formatAmount(farm.earned, 18))}`,
        secondText: 'SPIRIT',
      },
      update: 'portfolio',
      updateTarget: 'user',
    });

    addToQueue(response);

    await tx.wait();
    return { success: true };
  } catch (e) {
    return { success: false };
  }
};
