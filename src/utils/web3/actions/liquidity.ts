import addresses from 'constants/contracts';
import { BigNumber, BigNumberish, Contract as ContractItf } from 'ethers';
import { defaultAbiCoder, formatUnits, parseUnits } from 'ethers/lib/utils';
import { MaxUint256 } from '@ethersproject/constants';
import { BASE_TOKEN_ADDRESS, CHAIN_ID } from 'constants/index';
import { DEFAULT_GAS_LIMIT } from './general';
import { Contract } from '../contracts';
import {
  Token,
  TokenAmount,
  SobToken,
  SobSwap,
  SobTokenPool,
  WeightedTokenPool,
} from 'app/interfaces/General';
import { DEFAULT_DEADLINE_FROM_NOW } from 'constants/index';
import { WFTM } from 'constants/tokens';

import {
  transactionResponse,
  calculateGasMargin,
  calculateSlippageAmount,
} from './utils';
import {
  formatAmount,
  getLPSymbolFromSymbols,
  getRoundedSFs,
  truncateTokenValue,
} from 'app/utils';
import { getProvider } from 'app/connectors/EthersConnector/login';
import { setupNetwork } from '../wallet';
import { Multicall } from 'utils/web3';
import { Call } from 'utils/data/types';
import { allV1farms } from 'constants/farms';
import contracts from 'constants/contracts';
import { IDerivedMintInfo } from 'store/v3/mint/hooks';
import { Currency, CurrencyAmount, Percent, WETH9 } from '../../../v3-sdk';
import { NonfungiblePositionManager } from '../../../v3-sdk';

import { SWAP_SLIPPAGE_TOLERANCE_INDEX_KEY } from 'constants/index';
import { ExtendedEther } from '../../../v3-sdk/entities/ExtendedEther';

const BATCH_SWAP_TYPE_IN = 0;
const SWAP_FEE_PERCENTAGE = '150000000000000000';

const MINIMUM_LIQUIDITY = BigNumber?.from(10 ** 3);

export const sobVaultContract = async () => {};

export enum WeightedJoinKinds {
  INIT = 0, // Sends precise amount
  EXACT_TOKENS_IN_FOR_BPT_OUT, // Exact Tokens Join - Precise amounts of each tokens are sent, estimated LP is received
  TOKEN_IN_FOR_EXACT_BPT_OUT, // Single Token Join - Precise amount of single token sent, estimated LP is received
  ALL_TOKENS_IN_FOR_EXACT_BPT_OUT, // Proportional Join - User sends estimated but unknown quantities of tokens, precise LP is received
}

export enum WeightedExitKind {
  EXACT_BPT_IN_FOR_ONE_TOKEN_OUT, // Single Asset exit
  EXACT_BPT_IN_FOR_TOKENS_OUT, // Proportional Exist
  BPT_IN_FOR_EXACT_TOKENS_OUT, // Custom Exit - Estimated but unkown amount sent, receive exact quantities of specified tokens
}

export const userEncoding = {
  joinWeighted: {
    [WeightedJoinKinds.INIT]: {
      ABI: ['uint256', 'uint256[]'],
      userData: amountsIn => [WeightedJoinKinds.INIT, amountsIn],
    },
    [WeightedJoinKinds.EXACT_TOKENS_IN_FOR_BPT_OUT]: {
      ABI: ['uint256', 'uint256[]', 'uint256'],
      userData: (amountsIn, minimumBPT) => [
        WeightedJoinKinds.EXACT_TOKENS_IN_FOR_BPT_OUT,
        amountsIn,
        minimumBPT,
      ],
    },
    [WeightedJoinKinds.TOKEN_IN_FOR_EXACT_BPT_OUT]: {
      ABI: ['uint256', 'uint256', 'uint256'],
      userData: (bptAmountOut, enterTokenIndex) => [
        WeightedJoinKinds.TOKEN_IN_FOR_EXACT_BPT_OUT,
        bptAmountOut,
        enterTokenIndex,
      ],
    },
    [WeightedJoinKinds.ALL_TOKENS_IN_FOR_EXACT_BPT_OUT]: {
      ABI: ['uint256', 'uint256'],
      userData: bptAmountOut => [
        WeightedJoinKinds.ALL_TOKENS_IN_FOR_EXACT_BPT_OUT,
        bptAmountOut,
      ],
    },
  },
  exitWeighted: {
    [WeightedExitKind.EXACT_BPT_IN_FOR_ONE_TOKEN_OUT]: {
      ABI: ['uint256', 'uint256', 'uint256'],
      userData: (bptAmountIn, exitTokenIndex) => [
        WeightedExitKind.EXACT_BPT_IN_FOR_ONE_TOKEN_OUT,
        bptAmountIn,
        exitTokenIndex,
      ],
    },
    [WeightedExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT]: {
      ABI: ['uint256', 'uint256'],
      userData: bptAmountIn => [
        WeightedExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT,
        bptAmountIn,
      ],
    },
    [WeightedExitKind.BPT_IN_FOR_EXACT_TOKENS_OUT]: {
      ABI: ['uint256', 'uint256[]', 'uint256'],
      userData: (amountsOut, maxBPTAmountIn) => [
        WeightedExitKind.BPT_IN_FOR_EXACT_TOKENS_OUT,
        amountsOut,
        maxBPTAmountIn,
      ],
    },
  },
};

export const vaultContract = async (type: 'stable' | 'weighted' = 'stable') => {
  const _connector = getProvider();
  let contract = 'sobVault';

  if (type === 'weighted') {
    contract = 'wVault';
  }

  const sobVContract = await Contract(
    addresses[contract][CHAIN_ID],
    contract,
    _connector,
    CHAIN_ID,
  );

  return sobVContract;
};

export const weightedTxData = (
  amountsIn: BigNumberish | BigNumberish[],
  minimumBPT: BigNumberish | BigNumberish[],
  type: 'joinWeighted' | 'exitWeighted',
  kind: WeightedJoinKinds | WeightedExitKind,
) => {
  const { ABI, userData } = userEncoding[type][kind];
  const encodedData = defaultAbiCoder.encode(
    ABI,
    userData(amountsIn, minimumBPT),
  );

  return encodedData;
};

export const swapForSobTokens = async (
  poolSelected,
  swapAmounts,
  tokensWithAmount,
  account: string,
) => {
  const contract = await vaultContract();

  const tokenAddresses = buildTokenaddresses(poolSelected, 'tokens-in');

  const tokenAmountMap = buildTokenAmountMap(tokensWithAmount);

  const swaps = buildSwaps(poolSelected, tokenAmountMap, tokenAddresses);

  const funds = getFundManagement(account);

  const limits = swapAmounts.map(swapAmount => swapAmount.toString());

  const gasPrice = await contract.signer.getGasPrice();

  const tx = await contract.batchSwap(
    BATCH_SWAP_TYPE_IN,
    swaps,
    tokenAddresses,
    funds,
    limits,
    MaxUint256,
    {
      value: '0',
      gasPrice,
      gasLimit: DEFAULT_GAS_LIMIT,
    },
  );

  return transactionResponse('liquidity.add', {
    operation: 'LIQUIDITY',
    tx: tx,
    update: 'liquidity',
    updateTarget: 'user',
  });
};

export const queryPoolTx = async (
  poolSelected: WeightedTokenPool,
  account: string,
  txData: string,
  queryType: 'queryExit' | 'queryJoin',
  poolType: 'weighted' | 'stable' = 'weighted',
) => {
  const contract = await vaultContract(poolType);

  // We get the data to make the query
  const [, balances, lastChangeBlock] = await contract.getPoolTokens(
    poolSelected.poolId,
  );

  const poolContract = await Contract(poolSelected.address, 'wPool');

  const query = await poolContract.callStatic[queryType](
    poolSelected.poolId,
    account,
    account,
    balances,
    lastChangeBlock,
    SWAP_FEE_PERCENTAGE,
    txData,
  );

  return query;
};

export const queryJoinPool = async (
  poolSelected,
  tokensWithAmount,
  account: string,
) => {
  const tokensIn = buildTokenaddresses(poolSelected, 'tokens-in', 'tokens');
  const amountMappings = buildTokenAmountMap(tokensWithAmount);
  const amountsIn = tokensIn.map(address =>
    BigNumber.from(amountMappings.get(`${address}`.toLowerCase())),
  );
  const poolContract = await Contract(poolSelected.address, 'wPool');
  const totalSupply = await poolContract.totalSupply();

  const maxAmountsIn = amountsIn;

  const txData = weightedTxData(
    maxAmountsIn,
    '0',
    'joinWeighted',
    totalSupply
      ? WeightedJoinKinds.EXACT_TOKENS_IN_FOR_BPT_OUT
      : WeightedJoinKinds.INIT,
  );

  const query = await queryPoolTx(poolSelected, account, txData, 'queryJoin');
  const [amountOut] = query;
  const liquidity = parseFloat(
    `${formatUnits(amountOut, poolSelected?.decimals || 18)}`,
  );

  const formattedSupply = Number(
    formatUnits(totalSupply, poolSelected?.decimals || 18),
  );
  const ownership = +liquidity / formattedSupply;

  const response: AddLiquidityTradeV2 = {
    account,
    tokensWithValue: tokensWithAmount,
    pool: poolSelected,
    liquidity: !liquidity
      ? '0'
      : liquidity < 0.00001
      ? '< 0.00001'
      : liquidity.toFixed(5),
    ownership,
  };

  return response;
};

export const queryExitPool = async (
  poolSelected: WeightedTokenPool,
  withdrawalAmount,
  tokensWithAmount,
  account: string,
  txKind: WeightedExitKind = WeightedExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT,
) => {
  const tokensOut = buildTokenaddresses(poolSelected, 'tokens-in', 'tokens');
  const amountMappings = buildTokenAmountMap(tokensWithAmount);
  const tokenAmountsOut = tokensOut.map(address =>
    BigNumber.from(amountMappings.get(`${address}`.toLowerCase())),
  );

  // We format input amount
  const bigNumberWithdrawalAmount = parseUnits(
    withdrawalAmount,
    poolSelected.decimals,
  );

  const exactIn = txKind === WeightedExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT;
  const txData = weightedTxData(
    exactIn ? bigNumberWithdrawalAmount.toString() : tokenAmountsOut,
    exactIn ? tokenAmountsOut : bigNumberWithdrawalAmount.toString(),
    'exitWeighted',
    txKind,
  );

  // Query estimated amounts out
  const query = await queryPoolTx(poolSelected, account, txData, 'queryExit');

  const amountsOut = query['amountsOut'];
  const response = [...tokensWithAmount];
  response.forEach((data, index) => {
    data.amount = formatUnits(amountsOut[index], data.token.decimals);
  });

  return response;
};

export const addWeightedLiquidity = async (
  poolSelected,
  tokensWithAmount,
  account: string,
) => {
  const contract = await vaultContract('weighted');
  const tokensIn = buildTokenaddresses(poolSelected, 'tokens-in', 'tokens');
  const amountMappings = buildTokenAmountMap(tokensWithAmount);
  const amountsIn = tokensIn.map(address =>
    BigNumber.from(amountMappings.get(`${address}`.toLowerCase())),
  );
  const poolContract = await Contract(poolSelected.address, 'wPool');
  const totalSupply = await poolContract.totalSupply();

  const maxAmountsIn = amountsIn;

  const txData = weightedTxData(
    maxAmountsIn,
    '0',
    'joinWeighted',
    totalSupply
      ? WeightedJoinKinds.EXACT_TOKENS_IN_FOR_BPT_OUT
      : WeightedJoinKinds.INIT,
  );

  const gasPrice = await contract.signer.getGasPrice();

  const tx = await contract.joinPool(
    poolSelected.poolId,
    account,
    account,
    {
      assets: tokensIn,
      maxAmountsIn,
      fromInternalBalance: false,
      userData: txData,
    },
    {
      value: '0',
      gasPrice,
      gasLimit: BigNumber.from('450000'),
    },
  );

  const inputSymbols = tokensWithAmount
    .map(data => data?.token?.symbol)
    .toString()
    .replace(/,/g, ' + ');

  return transactionResponse('liquidity.add', {
    tx,
    operation: 'LIQUIDITY',
    update: 'liquidity',
    updateTarget: 'user',
    inputSymbol: inputSymbols,
    outputSymbol: poolSelected.symbol,
  });
};

export const removeWeightedLiquidity = async (
  poolSelected: WeightedTokenPool,
  withdrawalAmount,
  tokensWithAmount,
  account: string,
  txKind: WeightedExitKind = WeightedExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT,
) => {
  const tokensOut = buildTokenaddresses(poolSelected, 'tokens-in', 'tokens');

  const amountMappings = buildTokenAmountMap(tokensWithAmount);
  const tokenAmountsOut = tokensOut.map(address =>
    BigNumber.from(amountMappings.get(`${address}`.toLowerCase())),
  );

  // We format input amount
  const bigNumberWithdrawalAmount = parseUnits(
    withdrawalAmount,
    poolSelected.decimals,
  );

  const exactIn = txKind === WeightedExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT;
  const txData = weightedTxData(
    exactIn ? bigNumberWithdrawalAmount.toString() : tokenAmountsOut,
    exactIn ? tokenAmountsOut : bigNumberWithdrawalAmount.toString(),
    'exitWeighted',
    txKind,
  );

  const contract = await vaultContract('weighted');

  // Query estimated amounts out
  const query = await queryPoolTx(poolSelected, account, txData, 'queryExit');

  const amountsOut = query['amountsOut'];

  const gasPrice = await contract.signer.getGasPrice();

  const tx = await contract.exitPool(
    poolSelected.poolId,
    account,
    account,
    {
      assets: tokensOut,
      minAmountsOut: amountsOut,
      userData: txData,
      toInternalBalance: false,
    },
    {
      value: '0',
      gasPrice,
      gasLimit: BigNumber.from('450000'),
    },
  );

  return transactionResponse('liquidity.remove', {
    tx,
    operation: 'LIQUIDITY',
    inputSymbol: poolSelected.symbol,
    update: 'liquidity',
    updateTarget: 'user',
  });
};

export const removeSobLiquidity = async (
  poolSelected,
  tokensWithAmount,
  account: string,
) => {
  const deadlineFromNow =
    Math.ceil(Date.now() / 1000) + DEFAULT_DEADLINE_FROM_NOW;

  const contract = await vaultContract();

  const tokenAddresses = buildTokenaddresses(poolSelected);

  const assets = buildTokenaddresses(poolSelected);

  const tokenAmountMap = buildTokenAmountMap(
    tokensWithAmount,
    poolSelected.decimals,
  );

  const swaps = buildSwaps(
    poolSelected,
    tokenAmountMap,
    tokenAddresses,
    'remove',
  );

  const funds = await getFundManagement(account.toLowerCase());

  const limits = await contract.callStatic.queryBatchSwap(
    BATCH_SWAP_TYPE_IN,
    swaps,
    assets,
    funds,
  );

  const tx = await contract.batchSwap(
    BATCH_SWAP_TYPE_IN,
    swaps,
    assets,
    funds,
    limits,
    deadlineFromNow,
    {
      gasLimit: DEFAULT_GAS_LIMIT,
    },
  );

  return transactionResponse('liquidity.remove', {
    tx,
    operation: 'LIQUIDITY',
    inputSymbol: poolSelected.symbol,
    update: 'liquidity',
    updateTarget: 'user',
  });
};

export const addSobLiquidity = async (
  poolSelected: SobTokenPool | undefined,
  tokensWithAmount: TokenAmount[] | undefined,
  account: string,
  mode: string = 'default',
) => {
  let assets: string[] = [];

  if (poolSelected && tokensWithAmount) {
    await setupNetwork();

    const deadlineFromNow =
      Math.ceil(Date.now() / 1000) + DEFAULT_DEADLINE_FROM_NOW;
    assets = buildTokenaddresses(poolSelected);

    const tokenAmountMap = buildTokenAmountMap(tokensWithAmount);

    const swaps = buildSwaps(poolSelected, tokenAmountMap, assets);

    const contract = await vaultContract();

    const funds = await getFundManagement(account.toLowerCase());

    // Query batch returns limits needed to perform batchswap
    const limits = await contract.callStatic.queryBatchSwap(
      BATCH_SWAP_TYPE_IN,
      swaps,
      assets,
      funds,
    );

    let liquidity;

    limits.forEach((balance, index) => {
      const asset = assets[index];

      if (
        `${asset.toLowerCase()}` === `${poolSelected.address.toLowerCase()}`
      ) {
        liquidity = Math.abs(
          parseFloat(`${formatUnits(balance, poolSelected.decimals || 18)}`),
        );
      }
    });

    if (mode === 'query') {
      const poolContract = await Contract(poolSelected.address, 'wPool');
      const totalSupply = await poolContract.totalSupply();

      const formattedSupply = Number(
        formatUnits(totalSupply, poolSelected?.decimals || 18),
      );
      const ownership = liquidity / formattedSupply;

      const trade: AddLiquidityTradeV2 = {
        account,
        tokensWithValue: tokensWithAmount,
        pool: poolSelected,
        liquidity: !liquidity
          ? '0'
          : liquidity < 0.00001
          ? '< 0.00001'
          : liquidity.toFixed(5),
        ownership,
      };

      return {
        BATCH_SWAP_TYPE_IN,
        swaps,
        assets,
        funds,
        limits,
        trade,
      };
    }

    const tx = await contract.batchSwap(
      BATCH_SWAP_TYPE_IN,
      swaps,
      assets,
      funds,
      limits,
      deadlineFromNow,
      {
        gasLimit: DEFAULT_GAS_LIMIT,
      },
    );

    const inputSymbols = tokensWithAmount
      .map(data => data?.token?.symbol)
      .toString()
      .replace(/,/g, ' + ');

    return transactionResponse('liquidity.add', {
      tx,
      operation: 'LIQUIDITY',
      inputSymbol: inputSymbols,
      outputSymbol: poolSelected.symbol,
      update: 'liquidity',
      updateTarget: 'user',
    });
  } else {
    return [];
  }
};

const buildTokenaddresses = (
  poolToken: SobTokenPool | WeightedTokenPool,
  mode = 'all',
  source = 'sobTokens',
): string[] => {
  let addresses: string[] = [];
  const tokensMap = poolToken[source] as SobToken[];

  tokensMap?.forEach(token => {
    if (mode === 'tokens-in') {
      const address =
        source === 'sobTokens' ? token.tokenIn.address : token.address;

      addresses = [...addresses, address];
    } else if (mode === 'sob-only') {
      addresses = [...addresses, token.address];
    } else {
      addresses = [...addresses, token.tokenIn.address, token.address];
    }
  });

  if (!['tokens-in', 'sob-only'].includes(mode)) {
    addresses = [...addresses, poolToken.address];
  }

  // We need to duplicated from array
  const formattedAddresses: string[] = [];

  addresses.forEach((address: string) => {
    if (!formattedAddresses.includes(address)) {
      formattedAddresses.push(address);
    }
  });

  return formattedAddresses;
};

const buildTokenAmountMap = (
  tokenAmounts: TokenAmount[],
  decimalOverride?: number,
) => {
  const tokenAmountsMap = new Map();
  tokenAmounts.forEach(t => {
    tokenAmountsMap.set(
      `${t.token.address}`.toLowerCase(),
      parseUnits(`${t.amount}`, decimalOverride || t.token.decimals).toString(),
    );
  });
  return tokenAmountsMap;
};

declare type FundManagement = {
  sender: string;
  fromInternalBalance: boolean;
  recipient: string;
  toInternalBalance: boolean;
};

const getFundManagement = (account: string): FundManagement => {
  const funds: FundManagement = {
    sender: account,
    recipient: account,
    fromInternalBalance: false,
    toInternalBalance: false,
  };
  return funds;
};

const buildSwaps = (
  poolSelected,
  tokenAmountMap,
  assets,
  flow: 'default' | 'remove' = 'default',
) => {
  let swaps: SobSwap[] = [];

  poolSelected.sobTokens.forEach(sobToken => {
    let swapA = {
      poolId: sobToken.poolId,
      assetInIndex: assets.indexOf(sobToken.tokenIn.address),
      assetOutIndex: assets.indexOf(sobToken.address),
      amount: tokenAmountMap.get(sobToken.tokenIn.address.toLowerCase()) ?? '0',
      userData: '0x',
    };
    let swapB = {
      poolId: poolSelected.poolId,
      assetInIndex: assets.indexOf(sobToken.address),
      assetOutIndex: assets.indexOf(poolSelected.address),
      amount: tokenAmountMap.get(sobToken.address.toLowerCase()) ?? '0',
      userData: '0x',
    };

    if (flow === 'remove') {
      swapA = {
        poolId: poolSelected.poolId,
        assetInIndex: assets.indexOf(poolSelected.address),
        assetOutIndex: assets.indexOf(sobToken.address),
        amount:
          tokenAmountMap.get(sobToken.tokenIn.address.toLowerCase()) ?? '0',
        userData: '0x',
      };
      swapB = {
        poolId: sobToken.poolId,
        assetInIndex: assets.indexOf(sobToken.address),
        assetOutIndex: assets.indexOf(sobToken.tokenIn.address),
        amount: tokenAmountMap.get(sobToken.address.toLowerCase()) ?? '0',
        userData: '0x',
      };
    }

    swaps = [...swaps, swapA, swapB];
  });

  return swaps;
};

export const checkLpPairCreated = async ({
  tokenA,
  tokenB,
  isV2,
  isStable,
  chainID = CHAIN_ID,
}: {
  tokenA: Token;
  tokenB: Token;
  isV2?: boolean;
  isStable?: boolean;
  chainID?: number;
}) => {
  let pairAddress: string = '';
  let altPairAddress: string = '';
  let lpSymbol: string = '';
  let pool;

  const tokenASymbol = tokenA.symbol === 'FTM' ? WFTM.address : tokenA.address;
  const tokenBSymbol = tokenB.symbol === 'FTM' ? WFTM.address : tokenB.address;

  if (isV2) {
    const router = await Contract(addresses.factoryV2[chainID], 'factoryV2');

    const [lpPair, altLpPair] = await Promise.all([
      router.getPair(tokenASymbol, tokenBSymbol, isStable ?? false),
      router.getPair(tokenASymbol, tokenBSymbol, !(isStable ?? false)),
    ]);

    if (lpPair === BASE_TOKEN_ADDRESS) pairAddress = '';
    else pairAddress = lpPair;
    if (altLpPair === BASE_TOKEN_ADDRESS) altPairAddress = '';
    else altPairAddress = altLpPair;

    lpSymbol = getLPSymbolFromSymbols([tokenA.symbol, tokenB.symbol]);
  } else {
    [pool] = allV1farms.filter(farm => {
      const lpSymbol = farm.lpSymbol.replace(' LP', '').split('-');
      return (
        lpSymbol.includes(tokenA.symbol) && lpSymbol.includes(tokenB.symbol)
      );
    });

    if (pool) {
      pairAddress = pool.lpAddresses[chainID];
      lpSymbol = pool.lpSymbol;
    } else {
      const factoryContract = await Contract(
        contracts.factory[CHAIN_ID],
        'factory',
      );
      const lpPair = await factoryContract.getPair(tokenASymbol, tokenBSymbol);

      if (lpPair === BASE_TOKEN_ADDRESS) pairAddress = '';
      else pairAddress = lpPair;
      lpSymbol = getLPSymbolFromSymbols([tokenA.symbol, tokenB.symbol]);
    }
  }

  return {
    pairAddress,
    altPairAddress,
    pairIsCreated: Boolean(pairAddress),
    lpSymbol: lpSymbol,
  };
};

export interface AddLiquidityTrade {
  lpSymbol: string;
  lpAddress: string;
  tokenA: Token;
  tokenB: Token;
  amountA: string;
  optimizedAmountA: string;
  slippageA: string[];
  amountB: string;
  optimizedAmountB: string;
  slippageB: string[];
  reservesA: string;
  reservesB: string;
  totalSupply: string;
  method: string;
  liquidity: string;
  minimumLiquidity: string;
  ownership: string;
  slippage?: string;
  deadline?: string;
  exactLiquidity?: string;
  pool?: SobTokenPool;
  tokensWithValue?: {
    token: Token;
    amount: any;
  }[];
  gasPrice?: string;
}

export interface AddLiquidityTradeV2 {
  ownership?: number;
  pool?: SobTokenPool;
  tokensWithValue: {
    token: Token;
    amount: any;
  }[];
  liquidity?: string;
  account: string;
  gasPrice?: string;
  exactLiquidity?: string;
}

export interface AddLiquidityTradeV3 {
  mintInfo: IDerivedMintInfo;
  deadline: number;
  slippage: string;
  account: string;
}

export interface PairTradeData {
  buyToken: Token;
  sellToken: Token;
  buyAmount: string;
  sellAmount: string;
  buyReserve: string;
  sellReserve: string;
  price: string;
}

export interface PairData {
  pair: ContractItf;
  tokenAisToken0: boolean;
  token0: string;
  reserveOne: BigNumber;
  reserveTwo: BigNumber;
  totalSupply: BigNumber;
  price?: string;
  pooledOne?: number;
  pooledTwo?: number;
  poolShare?: number;
}

export const routerContract = async (
  _connector = getProvider(),
  _chainId = CHAIN_ID,
) => {
  const routerInstance = await Contract(
    addresses.router[CHAIN_ID],
    'router',
    _connector,
    _chainId,
  );

  return routerInstance;
};

export const routerV2Contract = async (
  _connector = getProvider(),
  _chainId = CHAIN_ID,
) => {
  const routerInstance = await Contract(
    addresses.routerV2[CHAIN_ID],
    'routerV2',
    _connector,
    _chainId,
  );

  return routerInstance;
};

export const pairContract = async (
  _pairAddress: string,
  _connector = 'rpc',
  _chainId = CHAIN_ID,
) => {
  let connector = _connector;

  if (_connector === 'wallet') {
    connector = getProvider();
  }

  const pairInstance = await Contract(
    _pairAddress,
    'pair',
    connector,
    _chainId,
  );

  return pairInstance;
};

export const getMintFee = (_reserveA: number, _reserveB: number) => {};

export const getLiquidityMinted = (
  _totalSupplyOfPair: BigNumber,
  _tokenAmountA: BigNumber,
  _tokenAmountB: BigNumber,
  _reserveA: BigNumber,
  _reserveB: BigNumber,
  _minimumLiquidity?: BigNumber,
) => {
  let liquidity: BigNumber = BigNumber.from(0);
  const amountA = _tokenAmountA;
  const amountB = _tokenAmountB;

  if (_totalSupplyOfPair.toString() === '0') {
    if (!_minimumLiquidity) {
      throw new Error('LIQUIDITY: Minimum liquidity needs to be provided');
    }
  } else {
    const a = amountA.mul(_totalSupplyOfPair).div(_reserveA);
    const b = amountB.mul(_totalSupplyOfPair).div(_reserveB);
    liquidity = a.gt(b) ? b : a;
  }

  if (liquidity.lt(0)) {
    return BigNumber.from(0);
  }

  return liquidity;
};

export const quote = (
  minimumA: BigNumber,
  reserveA: BigNumber,
  reserveB: BigNumber,
  minimumB?: BigNumber,
) => {
  let equivalentAmount;
  if (minimumB && reserveA.eq(0) && reserveB.eq(0)) {
    const toNumberMultiply: number = parseFloat(`${minimumA.mul(minimumB)}`);
    const calculation = parseInt(`${Math.sqrt(toNumberMultiply)}`);

    equivalentAmount = BigNumber.from(`${calculation}`).sub(MINIMUM_LIQUIDITY);
  } else {
    equivalentAmount = minimumA.mul(reserveB).div(reserveA);
  }

  return equivalentAmount;
};

export const getPairData = async (
  _tokenA: Token,
  _tokenB: Token,
  _pairAddress,
  _isV2 = false,
  _lpTokenAmount = 0,
  _chainId = CHAIN_ID,
) => {
  const pair = await pairContract(_pairAddress);

  const calls: Call[] = [
    {
      address: _pairAddress,
      name: 'token0',
    },
    {
      address: _pairAddress,
      name: 'totalSupply',
    },
    {
      address: _pairAddress,
      name: 'getReserves',
    },
  ];

  const pairMulticalls = (await Multicall(calls, 'pair')).map(
    call => call.response,
  );

  const [[token0], [totalSupply], [reserveOne, reserveTwo]] = pairMulticalls;

  const tokenA =
    `${_tokenA.address}` === `${BASE_TOKEN_ADDRESS}`
      ? WFTM.address
      : _tokenA.address;

  const tokenAisToken0 =
    `${tokenA}`.toLowerCase() === `${token0}`.toLowerCase();

  // We get the minimum amounts here
  let pooledOne = 0;
  let pooledTwo = 0;
  let poolShare = 0;

  if (_lpTokenAmount) {
    pooledOne = reserveOne.mul(_lpTokenAmount).div(totalSupply);
    pooledTwo = reserveTwo.mul(_lpTokenAmount).div(totalSupply);
    poolShare = _lpTokenAmount / totalSupply;
  }

  const response: PairData = {
    pair,
    tokenAisToken0,
    token0,
    reserveOne,
    reserveTwo,
    totalSupply,
    pooledOne,
    pooledTwo,
    poolShare,
  };

  return response;
};

export const getPooledData = async (
  _lpAddress: string,
  _lpTokenAmount = '0',
  _chainId = CHAIN_ID,
) => {
  // We call the pair contract to get data for calculations
  const pair = await pairContract(_lpAddress);

  const token0 = await pair.token0();
  const token1 = await pair.token1();
  const totalSupply = await pair.totalSupply();
  const [reserveOne, reserveTwo] = await pair.getReserves();

  // We get the minimum amounts here
  let pooled0 = 0;
  let pooled1 = 0;
  let poolShare = '0';

  const lpSupply = parseFloat(totalSupply.toString()) / 10 ** 18;

  if (_lpTokenAmount) {
    const lpTokenAmount = parseUnits(_lpTokenAmount, 18);
    pooled0 = parseFloat(
      reserveOne.mul(lpTokenAmount).div(totalSupply).toString(),
    );
    pooled1 = parseFloat(
      reserveTwo.mul(lpTokenAmount).div(totalSupply).toString(),
    );
  }
  poolShare = totalSupply
    ? `${getRoundedSFs(`${(parseFloat(_lpTokenAmount) / lpSupply) * 100}`)} %`
    : 'Unknown';

  const response = {
    token0,
    token1,
    pooled0,
    pooled1,
    poolShare,
    lpSupply,
  };

  return response;
};

export const pairTradingData = async (params, isV2 = false) => {
  // TODO: Remove usage of quoteRate API, not really necessary
  const { buyToken, sellToken, pairAddress } = params;

  if (!pairAddress)
    return {
      tx: undefined,
      pairData: {
        token0: '',
        totalSupply: BigNumber.from(0),
        reserveOne: BigNumber.from(0),
        reserveTwo: BigNumber.from(0),
      },
    };

  const pairData = await getPairData(buyToken, sellToken, pairAddress, isV2);

  const { tokenAisToken0, reserveOne, reserveTwo, totalSupply, token0 } =
    pairData;

  const buyReserve = tokenAisToken0 ? reserveOne : reserveTwo;
  const sellReserve = tokenAisToken0 ? reserveTwo : reserveOne;

  let buyAmount = BigNumber.from(params.buyAmount);
  let sellAmount = BigNumber.from(params.sellAmount);

  if (buyAmount.eq(0)) {
    buyAmount = quote(sellAmount, sellReserve, buyReserve);
  }

  if (sellAmount.eq(0)) {
    sellAmount = quote(buyAmount, buyReserve, sellReserve);
  }

  let price: string = '';
  price = truncateTokenValue(
    parseFloat(`${sellAmount}`) / parseFloat(`${buyAmount}`),
  );

  if (isNaN(+price)) price = '0';

  const response: PairTradeData = {
    price: price,
    buyToken,
    sellToken,
    buyAmount: buyAmount.toString(),
    sellAmount: sellAmount.toString(),
    buyReserve: buyReserve.toString(),
    sellReserve: sellReserve.toString(),
  };

  const pairInfo = {
    token0: token0,
    totalSupply: totalSupply,
    reserveOne: reserveOne,
    reserveTwo: reserveTwo,
  };

  return {
    tx: response,
    pairData: pairInfo,
  };
};

export const getLiquidityData = async (
  _pairData: {
    token0: string;
    totalSupply: BigNumber;
    reserveOne: BigNumber;
    reserveTwo: BigNumber;
  },
  _pairAddress: string,
  _lpSymbol: string,
  _tokenA: Token,
  _tokenB: Token,
  _amountA: string,
  _amountB: string,
  _balanceA: string,
  _balanceB: string,
  _gasPrice: string,
  _slippage: number = 10, // Slippage amount
  _chainId = CHAIN_ID,
  isV2 = false,
  isStable: boolean = false,
) => {
  let token0 = _pairData.token0;
  let totalSupply = _pairData.totalSupply;
  let reserveOne = _pairData.reserveOne;
  let reserveTwo = _pairData.reserveTwo;
  let minimumLiquidity = MINIMUM_LIQUIDITY;
  let decimals = 18;

  if (_pairAddress) {
    const calls: Call[] = [
      {
        address: _pairAddress,
        name: 'decimals',
      },
    ];

    if (!isV2) {
      calls.push({
        address: _pairAddress,
        name: 'MINIMUM_LIQUIDITY',
      });
    }

    const pairMulticalls = (await Multicall(calls, 'pair')).map(
      call => call.response,
    );

    [[decimals]] = pairMulticalls;

    if (isV2) {
      minimumLiquidity = MINIMUM_LIQUIDITY;
    } else {
      minimumLiquidity = pairMulticalls[1][0];
    }
  }

  // We organize our data based on whether tokenA is the first token of the pair
  let tokenAaddress: string = _tokenA.address;
  if (_tokenA.address === BASE_TOKEN_ADDRESS) tokenAaddress = WFTM.address;

  // If no token0 == pool not created
  const tokenAisToken0 = tokenAaddress.toLowerCase() === token0.toLowerCase();

  const amountA = tokenAisToken0 ? _amountA : _amountB;
  const amountB = tokenAisToken0 ? _amountB : _amountA;
  const reservesA = tokenAisToken0 ? reserveOne : reserveTwo;
  const decimalsA = tokenAisToken0 ? _tokenA.decimals : _tokenB.decimals;
  const reservesB = tokenAisToken0 ? reserveTwo : reserveOne;
  const decimalsB = tokenAisToken0 ? _tokenB.decimals : _tokenA.decimals;
  const BigNumberA = parseUnits(amountA, decimalsA);
  const BigNumberB = parseUnits(amountB, decimalsB);

  // We calculate the optimized amounts for trade here, we treat amountA and amountB as minimums
  let optimizedAmountA = BigNumberA;
  let optimizedAmountB = BigNumberB;

  let liquidity;
  if (_pairAddress) {
    optimizedAmountA = quote(BigNumberB, reservesB, reservesA);
    optimizedAmountB = quote(BigNumberA, reservesA, reservesB);

    liquidity = getLiquidityMinted(
      totalSupply,
      BigNumberA,
      BigNumberB,
      reservesA,
      reservesB,
      minimumLiquidity,
    );
  } else {
    liquidity = quote(BigNumberA, reservesA, reservesB, BigNumberB);
  }

  const liquidityF = parseFloat(`${liquidity}`);
  const totalSupplyF = parseFloat(`${totalSupply}`);
  const ownership = `${(liquidityF / (liquidityF + totalSupplyF)) * 100}`;

  const finalLiquidity = parseFloat(`${formatUnits(`${liquidity}`, decimals)}`);

  const data: AddLiquidityTrade = {
    lpSymbol: _lpSymbol.replace(' LP', isStable ? ' sLP' : ' vLP'),
    lpAddress: _pairAddress,
    tokenA: tokenAisToken0 ? _tokenA : _tokenB,
    tokenB: tokenAisToken0 ? _tokenB : _tokenA,
    amountA,
    amountB,
    reservesA: formatUnits(reservesA, decimalsA),
    reservesB: formatUnits(reservesB, decimalsB),
    totalSupply: formatUnits(totalSupply, decimals),
    // TODO: Make this blockchain dependent
    method:
      _tokenA.symbol === 'FTM' || _tokenB.symbol === 'FTM'
        ? 'addLiquidityETH'
        : 'addLiquidity',
    liquidity: !finalLiquidity
      ? '0'
      : finalLiquidity < 0.00001
      ? '< 0.00001'
      : finalLiquidity.toFixed(5),
    exactLiquidity: finalLiquidity.toFixed(18),
    ownership:
      parseFloat(ownership) < 0.01 ? '<0.01%' : `${getRoundedSFs(ownership)}%`,
    minimumLiquidity: formatUnits(minimumLiquidity, decimals),
    slippageA: calculateSlippageAmount(BigNumberA, _slippage),
    slippageB: calculateSlippageAmount(BigNumberB, _slippage),
    optimizedAmountA: formatUnits(optimizedAmountA, decimalsA),
    optimizedAmountB: formatUnits(optimizedAmountB, decimalsB),
    gasPrice: _gasPrice,
  };

  return data;
};

export const addLiquidity = async (
  _userAddress: string,
  _trade: AddLiquidityTrade | undefined,
  isV2?: boolean,
  stable?: boolean,
) => {
  if (!_trade) {
    throw new Error('Need to provide trade data');
  }
  const deadlineFromNow =
    Math.ceil(Date.now() / 1000) +
    (parseInt(`${_trade.deadline}`) || DEFAULT_DEADLINE_FROM_NOW);

  let contractMethod = _trade.method;

  // We load our routes and blokchain data here
  let router;
  if (isV2) {
    router = await routerV2Contract();
    if (contractMethod === 'addLiquidityETH') {
      contractMethod = 'addLiquidityFTM';
    }
  } else {
    router = await routerContract();
  }

  const method = router[contractMethod || 'addLiquidity'];
  const estimate = router.estimateGas[contractMethod || 'addLiquidity'];

  const decimalsA = _trade.tokenA.decimals;
  const decimalsB = _trade.tokenB.decimals;

  const desiredAmountA = parseUnits(_trade.amountA, decimalsA).toString();
  const desiredAmountB = parseUnits(_trade.amountB, decimalsB).toString();
  const minimumAmountA = _trade.slippageA[0].toString();
  const minimumAmountB = _trade.slippageB[0].toString();

  const gasPrice = _trade.gasPrice;
  let args: (string | number | boolean)[] = [
    _trade.tokenA.address,
    _trade.tokenB.address,
    desiredAmountA,
    desiredAmountB,
    minimumAmountA,
    minimumAmountB,
    _userAddress,
    deadlineFromNow,
  ];

  if (isV2 && stable !== undefined) {
    args.splice(2, 0, stable);
  }

  let value: BigNumber = BigNumber.from('0');
  const firstIsTarget = _trade.tokenA.symbol !== 'FTM';

  if (`${_trade.method}` === 'addLiquidityETH') {
    const targetAddress = firstIsTarget
      ? _trade.tokenA.address
      : _trade.tokenB.address;
    const targetDesiredAmount = firstIsTarget ? desiredAmountA : desiredAmountB;
    const targetMinimumAmount = firstIsTarget ? minimumAmountA : minimumAmountB;
    const minimumFTM = firstIsTarget ? minimumAmountB : minimumAmountA;

    const valueAmount = firstIsTarget ? _trade.amountB : _trade.amountA;
    value = parseUnits(valueAmount, 18);

    args = [
      targetAddress, // Address of target
      targetDesiredAmount,
      targetMinimumAmount,
      minimumFTM,
      _userAddress,
      deadlineFromNow,
    ];

    if (isV2 && stable !== undefined) {
      args.splice(1, 0, stable);
    }
  }

  const estimatedGas = await estimate(...args, value ? { value } : {});

  const tx = await method(...args, {
    value,
    gasLimit: calculateGasMargin(estimatedGas),
    gasPrice,
  });

  return transactionResponse('liquidity.add', {
    tx,
    operation: 'LIQUIDITY',
    inputSymbol: `${_trade.tokenA.symbol} + ${_trade.tokenB.symbol}`,
    // inputValue: formatAmount(_trade.amountA, _trade.tokenA.decimals),
    // outputSymbol: _trade.tokenB.symbol,
    outputSymbol: _trade.lpSymbol,
    // outputValue: formatAmount(_trade.amountB, _trade.tokenB.decimals),
    update: 'liquidity',
    updateTarget: 'user',
  });
};

export const removeLiquidity = async (
  _userAddress: string,
  _pair: Token,
  tokenA: Token,
  tokenB: Token,
  _amount: string,
  _isV2: boolean,
  _isStable: boolean,
  _slippage: number = 10, // Slippage amount
  _deadline: number = DEFAULT_DEADLINE_FROM_NOW,
  _chainId = CHAIN_ID,
) => {
  const symbols = _pair.symbol
    .replace(' vLP', '')
    .replace(' sLP', '')
    .replace(' LP', '')
    .split('-');
  const pairHasETH = symbols.includes('FTM');

  let router;
  if (_isV2) {
    router = await routerV2Contract();
  } else {
    router = await routerContract();
  }

  const pair = await pairContract(_pair.address);

  const [[reserveOne, reserveTwo], totalSupply] = await Promise.all([
    pair.getReserves(),
    pair.totalSupply(),
  ]);

  const liquidityAmount = parseUnits(_amount, 18);

  // We get the minimum amounts here
  const returnAmountA = reserveOne.mul(liquidityAmount).div(totalSupply);
  const returnAmountB = reserveTwo.mul(liquidityAmount).div(totalSupply);

  let methods: string[];
  let args;

  const deadlineFromNow =
    Math.ceil(Date.now() / 1000) + (_deadline || DEFAULT_DEADLINE_FROM_NOW);

  if (pairHasETH) {
    if (_isV2) {
      methods = ['removeLiquidityFTM'];
    } else {
      methods = [
        'removeLiquidityETH',
        'removeLiquidityETHSupportingFeeOnTransferTokens',
      ];
    }

    const tokenADesired = calculateSlippageAmount(
      tokenA?.symbol !== 'WFTM' ? returnAmountA : returnAmountB,
      _slippage,
    )[0].toString();

    const tokenBDesired = calculateSlippageAmount(
      tokenA?.symbol !== 'WFTM' ? returnAmountB : returnAmountA,
      _slippage,
    )[0].toString();

    args = [
      tokenA.symbol !== 'WFTM' ? tokenA.address : tokenB.address,
      liquidityAmount.toString(),
      tokenADesired,
      tokenBDesired,
      _userAddress,
      deadlineFromNow,
    ];

    if (_isV2 && _isStable !== undefined) {
      args.splice(1, 0, _isStable);
    }
  } else {
    methods = ['removeLiquidity'];
    args = [
      tokenA.address,
      tokenB.address,
      liquidityAmount.toString(),
      calculateSlippageAmount(returnAmountA, _slippage)[0].toString(),
      calculateSlippageAmount(returnAmountB, _slippage)[0].toString(),
      _userAddress,
      deadlineFromNow,
    ];

    if (_isV2 && _isStable !== undefined) {
      args.splice(2, 0, _isStable);
    }
  }

  const safeGasEstimates = await Promise.all(
    methods.map(method => router.estimateGas[method](...args)),
  );

  const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(
    safeGasEstimate => BigNumber.isBigNumber(safeGasEstimate),
  );

  const methodName = methods[indexOfSuccessfulEstimation];
  const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation];

  const tx = await router[methodName](...args, {
    gasLimit: safeGasEstimate,
  });

  return transactionResponse('liquidity.remove', {
    operation: 'LIQUIDITY',
    tx: tx,
    inputSymbol: tokenA.symbol,
    outputSymbol: tokenB.symbol,
    inputValue: formatAmount(returnAmountA.toString(), tokenA.decimals),
    outputValue: formatAmount(returnAmountB.toString(), tokenB.decimals),
    update: 'liquidity',
    updateTarget: 'user',
  });
};

export const estimateRemoveLiquidity = async (
  _userAddress: string,
  _lpAddress: string,
  tokenA: Token,
  tokenB: Token,
  _amount: string,
  _chainId = CHAIN_ID,
) => {
  const pair = await pairContract(_lpAddress);

  const [[reserveOne, reserveTwo], totalSupply] = await Promise.all([
    pair.getReserves(),
    pair.totalSupply(),
  ]);

  const liquidityAmount = parseUnits(_amount, 18);

  // We get the minimum amounts here
  const returnAmountA = reserveOne.mul(liquidityAmount).div(totalSupply);
  const returnAmountB = reserveTwo.mul(liquidityAmount).div(totalSupply);

  const tokenAmountA = {
    token: tokenA,
    amount: formatAmount(returnAmountA.toString(), tokenA?.decimals),
  };

  const tokenAmountB = {
    token: tokenB,
    amount: formatAmount(returnAmountB.toString(), tokenB?.decimals),
  };

  const result = new Map();
  result.set(tokenAmountA.token?.address, tokenAmountA);
  result.set(tokenAmountB.token?.address, tokenAmountB);

  return result;
};

export const nonfungiblePositionManagerContract = async () => {
  const _connector = getProvider();
  let contract = 'v3NonfungiblePositionManager';

  const nonfungiblePositionManagerContract = await Contract(
    addresses[contract][CHAIN_ID],
    contract,
    _connector,
    CHAIN_ID,
  );

  return nonfungiblePositionManagerContract;
};

export const addConcentratedLiquidity = async (
  mintInfo: IDerivedMintInfo,
  slippage: string,
  deadline: string,
  account: string,
) => {
  const contract = await nonfungiblePositionManagerContract();

  // TODO
  const allowedSlippage =
    slippage === 'Auto'
      ? mintInfo.outOfRange
        ? new Percent('0')
        : new Percent(50, 10_000)
      : new Percent(50, 10_000);

  let currencyA = mintInfo.currencies.CURRENCY_A;
  let currencyB = mintInfo.currencies.CURRENCY_B;

  // TODO

  if (
    currencyA?.wrapped.address.toLowerCase() ===
    '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'
  ) {
    currencyA = ExtendedEther.onChain(250);
  }

  if (
    currencyB?.wrapped.address.toLowerCase() ===
    '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'
  ) {
    currencyB = ExtendedEther.onChain(250);
  }

  const inputSymbols = [currencyA?.symbol, currencyB?.symbol]
    .toString()
    .replace(/,/g, ' + ');

  if (mintInfo.position) {
    const useNative = currencyA?.isNative
      ? currencyA
      : currencyB?.isNative
      ? currencyB
      : undefined;

    const { calldata, value } = NonfungiblePositionManager.addCallParameters(
      mintInfo.position,
      {
        slippageTolerance: allowedSlippage,
        recipient: account,
        // deadline: deadline.toString(),
        deadline: (Math.floor(Date.now() / 1000) + (20 ?? 0) * 60).toString(),
        useNative,
        createPool: mintInfo.noLiquidity,
      },
    );

    const estimatedGas = await contract.estimateGas['multicall'](calldata, {
      value,
    });

    const tx = await contract.multicall(calldata, {
      gasLimit: estimatedGas,
      value,
    });

    return transactionResponse('liquidity.add', {
      tx,
      operation: 'LIQUIDITY',
      update: 'liquidity',
      updateTarget: 'user',
      inputSymbol: inputSymbols,
    });
  }
};

export const removeConcentratedLiquidity = async (
  position: any,
  positionId: string,
  account: string,
  liquidityPercentage: Percent,
  feeValue0: CurrencyAmount<Currency>,
  feeValue1: CurrencyAmount<Currency>,
  slippage: string,
  deadline: number,
) => {
  const contract = await nonfungiblePositionManagerContract();

  const allowedSlippage = new Percent(50, 10_000);

  const { calldata, value } = NonfungiblePositionManager.removeCallParameters(
    position,
    {
      tokenId: positionId,
      liquidityPercentage,
      slippageTolerance: allowedSlippage,
      deadline: (Math.floor(Date.now() / 1000) + (20 ?? 0) * 60).toString(),
      collectOptions: {
        expectedCurrencyOwed0: feeValue0,
        expectedCurrencyOwed1: feeValue1,
        recipient: account,
      },
    },
  );

  const estimatedGas = await contract.estimateGas['multicall'](calldata, {
    value,
  });

  const tx = await contract.multicall(calldata, {
    gasLimit: estimatedGas,
    value,
  });

  return tx;
};
