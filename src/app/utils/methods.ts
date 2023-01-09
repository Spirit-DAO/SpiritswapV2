/**
 * app/utils/methods.ts
 *
 * Describe common functions
 *
 */

import { Sign, Currency, ChartProps } from './types';
import { CurrencySymbol } from './constants';

import { tokens, TOKEN_EMPTY, WFTM, SPIRIT } from 'constants/tokens';
import { formatUnits } from 'ethers/lib/utils';
import { BigNumber, FixedNumber } from 'ethers';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectWallet,
  selectSpiritClaimableAmount,
  selectBribesClaimableAmount,
  selectInspiritUserBalance,
  selectLockedInsSpiritEndDate,
  selectLockedInSpiritAmount,
  selectLimitOrders,
  selectLiquidityWallet,
  selectTrackedTokens,
  selectBridgeTokensFrom,
  selectBridgeTokensTo,
} from 'store/user/selectors';
import {
  selectTotalSpiritLocked,
  selectAverageSpiritUnlockTime,
  selectNextSpiritDistribution,
  selectLastSpiritDistribution,
  selectAprPercentage,
  selectInSpiritPerSpirit,
  selectSpiritInfo,
  selectStatisticsFromTimestamp,
  selectSaturatedGauges,
} from 'store/general/selectors';
import { formatPortfolioToWallet } from 'utils/web3';
import { setNewTrackedToken } from 'store/user';
import { Token } from 'app/interfaces/General';
import { BASE_TOKEN_ADDRESS, CHAIN_ID } from 'constants/index';
import BigNum from 'bignumber.js';
import allFarms, { farms, farmsV2 } from 'constants/farms';
import { FarmConfig } from 'constants/types';
import { BoostedFarm } from 'app/interfaces/Inspirit';
import moment from 'moment';

const FARM = allFarms;
FARM.shift();

export function convertTokenPrice(value: number, fixed?: number): string {
  let units = ['', 'K', 'M', 'B', 'T', 'Q'];
  let numberOfPlaces = Math.ceil(Math.log10(value));

  let unit = Math.floor((numberOfPlaces - 1) / 3);
  if (numberOfPlaces < 1) unit = 0;
  if (unit >= units.length) unit = units.length - 1;

  let x;
  x = value / Math.pow(10, unit * 3);

  if (fixed) {
    x = x.toFixed(fixed);
  }

  return Math.round(x * 1000) / 1000 + units[unit];
}

export const isValidBalance = (balance, input): boolean => {
  if (!balance) return false;
  if (!input) return false;
  const bgBalance = new BigNum(balance);
  const bgInput = new BigNum(input);
  return bgInput.isLessThanOrEqualTo(bgBalance);
};

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const convertAmount = (
  value: string | number,
  style = 'currency',
): string => {
  if (!value) return '';
  const params = {
    style,
    currency: 'USD',
  };
  if (typeof value === 'string') {
    return Number(value).toLocaleString('en-US', params);
  }
  return value.toLocaleString('en-US', params);
};

export function getSign(value: number | string): Sign {
  let number = 0;
  switch (typeof value) {
    case 'number':
      number = value;
      break;
    case 'string':
      number = Number(value);
      break;
  }

  if (number > 0) {
    return Sign.POSITIVE;
  }
  if (number < 0) {
    return Sign.NEGATIVE;
  }
  return Sign.NEUTRAL;
}

export function formatNumber({
  value,
  minDecmals,
  maxDecimals,
  hideDecimals,
}: {
  value: number;
  minDecmals?: number;
  maxDecimals?: number;
  hideDecimals?: boolean;
}) {
  let valueToFormat = value;
  const intl = Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: minDecmals,
  });

  if (hideDecimals) {
    let valueToString = value.toString();
    if (valueToString.includes('.')) {
      const indexOf = valueToString.indexOf('.');
      const integerPart = valueToString.slice(0, indexOf);
      valueToFormat = parseFloat(integerPart);
    }
  }

  return intl.format(valueToFormat);
}

const limitInputBasedOnDecimals = (value: string, decimals: number) => {
  const separateValue = value.split('.');
  const intergerPart = separateValue[0];
  const decimalPart = separateValue[1];
  if (decimalPart.length <= decimals) return value;

  return intergerPart[0] + '.' + decimalPart.substring(0, decimals);
};

export const validateInput = (string: string, tokenDecimals?: number) => {
  string = string.replaceAll('+', '');
  string = string.replaceAll('-', '');
  string = string.replaceAll('e', '');
  if (string === '') return '';
  if (string === '.') return '0.';
  if (string.startsWith('0') && string.length === 1) return string;
  if (string.startsWith('0') && string[1] !== '.') return string.substring(1);

  if (string.includes('.')) {
    const limitedInput = limitInputBasedOnDecimals(string, tokenDecimals ?? 18);
    const stringArr = limitedInput.split('');
    const dots = stringArr.filter(letter => letter === '.');
    return dots.length === 1 ? limitedInput : limitedInput.slice(0, -1);
  }
  return string;
};

export function formatCurrency(currency: Currency, amount: number): string {
  const currencySymbol = CurrencySymbol[currency];
  return `${currencySymbol} ${formatNumber({ value: amount })}`;
}

export function formatCryptoNumber(
  value: number,
  maxDecimals: number = 18,
): string {
  const intl = Intl.NumberFormat('en-US');
  const floorValue = Math.floor(value);
  const decimals = value - floorValue;
  const decimalsString = decimals.toString();
  const floorValueString = intl.format(floorValue + 0.1);

  if (floorValue === value) {
    return floorValue.toString();
  }

  return (
    floorValueString.substring(0, floorValueString.length - 1) +
    decimalsString.substr(2, Math.min(maxDecimals, decimalsString.length - 2))
  );
}

export const formatAmount = (
  amount: string,
  decimals: number,
  trunc: number = decimals,
) => {
  if (amount.includes('.')) {
    const indexOf = amount.indexOf('.');
    const integer = amount.slice(0, indexOf);
    const decimals = amount.slice(indexOf, trunc + 2);

    return integer.concat(decimals);
  }

  const amountFormatted = formatUnits(amount, decimals);
  return FixedNumber.fromString(amountFormatted).round(trunc).toString();
};

export const getRoundedSFs = (num: string, SFCount: number = 2) => {
  let matches = num.toString().match(/^-?(0+)\.(0*)/);
  if (Number.isInteger(parseFloat(num))) return parseFloat(num).toFixed(2);

  if (matches) {
    let firstIndex = matches[0].length;
    let prefix = matches[0];
    let sf = Number(
      num.toString().substring(firstIndex, firstIndex + SFCount + 1),
    );

    const newSf = prefix + sf.toString();
    const returnValue = Number(newSf).toFixed(matches[2].length + SFCount);
    const validOutPut = checkInvalidValue(returnValue);
    return validOutPut;
  } else {
    const validOutPut = checkInvalidValue(parseFloat(num).toFixed(2));
    return validOutPut;
  }
};

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  const displayBalance = BigNumber.from(balance).div(
    BigNumber.from(10).pow(decimals),
  );
  return displayBalance.toNumber();
};

export const getAmountUSD = (
  amount: string,
  price: string,
  decimals: number,
) => {
  const amountFormatted = formatUnits(amount, decimals);
  const fixedPrice = FixedNumber.fromString(price);
  return FixedNumber.fromString(amountFormatted)
    .mulUnsafe(fixedPrice)
    .round(2)
    .toString();
};

export const mathBalance = (
  balance: string,
  percentage: string,
  decimals: number,
): string => {
  return new BigNum(balance).multipliedBy(percentage).toFixed(decimals);
};

export const toFixedWithoutRounding = (number, digits): string => {
  return (
    Math.trunc(number * Math.pow(10, digits)) / Math.pow(10, digits)
  ).toFixed(digits);
};

export const truncateTokenValue = (
  value,
  tokenValueInUSD?: string | number,
  prepend: string = '',
): string => {
  // tokenValueInUSD is the price of 1 token in USD, it should always be passed unless the value is itself USD
  if (tokenValueInUSD && tokenValueInUSD > 0 && value > 0 && value < 0.01)
    return `<${prepend}0.01`;

  if (!value || value === '0' || value === '' || isNaN(value)) {
    return '0.00';
  }

  let numberOfIntegerDigits = 1;

  if (tokenValueInUSD) {
    if (typeof tokenValueInUSD === 'string') {
      tokenValueInUSD = parseFloat(tokenValueInUSD);
    }

    numberOfIntegerDigits =
      tokenValueInUSD < 1 ? 1 : Math.floor(Math.log10(tokenValueInUSD)) + 1;
  }

  if (typeof value === 'string') {
    value = parseFloat(value);
  }

  return `${prepend}${toFixedWithoutRounding(
    value,
    numberOfIntegerDigits + 1,
  )}`;
};

export const GetWalletBalance = () => {
  const balances = useAppSelector(selectWallet);
  const userWallet = formatPortfolioToWallet(balances);
  const userLiquidity = useAppSelector(selectLiquidityWallet);

  return { balances, userWallet, userLiquidity };
};

export const TrackedTokens = () => {
  const tracked = useAppSelector(selectTrackedTokens);

  return tracked;
};

export const GetBridgeWallets = () => {
  const originWallet = useAppSelector(selectBridgeTokensFrom);
  const destinationWallet = useAppSelector(selectBridgeTokensTo);

  return {
    originWallet,
    destinationWallet,
  };
};

export const GetBalanceByToken = (
  token: Token,
  bridge?: 'from' | 'to' | undefined,
) => {
  const walletBalance = useAppSelector(selectWallet);
  const walletLiquidity = useAppSelector(selectLiquidityWallet);
  const trackedTokens = useAppSelector(selectTrackedTokens);
  const dispatch = useAppDispatch();

  let target = walletBalance;

  if (bridge) {
    const { originWallet, destinationWallet } = GetBridgeWallets();
    target = bridge && bridge === 'from' ? originWallet : destinationWallet;
  }

  if (target || walletLiquidity) {
    const findToken = target?.find(
      walletToken =>
        (!['FTM'].includes(token.symbol) &&
          `${walletToken.symbol}`.toLocaleLowerCase() ===
            `${token.symbol}`.toLocaleLowerCase()) ||
        `${walletToken.address}`.toLocaleLowerCase() ===
          `${token.address}`.toLocaleLowerCase(),
    );

    const liquidityBalance =
      walletLiquidity &&
      walletLiquidity.find(
        LpToken =>
          `${LpToken.address}`.toLocaleLowerCase() ===
          `${token.address}`.toLocaleLowerCase(),
      );

    if (findToken) {
      const balance = formatAmount(findToken.amount, token.decimals);
      return { balance: balance, balanceUSD: findToken?.usd?.toString() };
    }

    if (liquidityBalance) {
      const balance = formatAmount(liquidityBalance.amount, token.decimals);
      return {
        balance,
        balanceUSD: liquidityBalance?.usd?.toString(),
      };
    }
  }

  // We reach this point if token is not in user's wallet
  // Here we can add it to the list of tokens we keep track in the app
  if (!trackedTokens || !trackedTokens.includes(token)) {
    dispatch(setNewTrackedToken(token));
  }

  return { balance: '0', balanceUSD: '0' };
};

export const GetTokenBySymbol = (tokenSymbol: string) => {
  const walletBalance = useAppSelector(selectWallet);

  const findToken = walletBalance?.find(
    walletToken => walletToken.symbol === tokenSymbol,
  );

  if (findToken) {
    return findToken;
  }

  return null;
};

export const GetVerifiedTokenFromAddres = (address: string) => {
  let token = tokens.find(
    token => token.address.toLowerCase() === address.toLowerCase(),
  );
  if (!token) {
    token = TOKEN_EMPTY;
  }
  return token;
};

export const GetSpiritLocked = () => {
  const spiritLocked = useAppSelector(selectLockedInSpiritAmount);

  return { spiritLocked };
};

export const GetInspiritData = () => {
  const { price: spiritPrice } = useAppSelector(selectSpiritInfo);
  const balance = useAppSelector(selectInspiritUserBalance);
  const spiritLocked = useAppSelector(selectLockedInSpiritAmount);
  const totalSpiritLocked = useAppSelector(selectTotalSpiritLocked);
  const spiritPerInspirit = useAppSelector(selectInSpiritPerSpirit);
  const lastSpiritDistribution = useAppSelector(selectLastSpiritDistribution);
  const nextSpiritDistribution = useAppSelector(selectNextSpiritDistribution);
  const statisticsFromTimestamp = useAppSelector(selectStatisticsFromTimestamp);
  const spiritClaimable = useAppSelector(selectSpiritClaimableAmount);
  const bribesClaimable = useAppSelector(selectBribesClaimableAmount);
  const lockedEnd = useAppSelector(selectLockedInsSpiritEndDate);
  const aprValue = useAppSelector(selectAprPercentage);
  const averageSpiritUnlockTime = useAppSelector(selectAverageSpiritUnlockTime);
  const spiritLockedValue = parseFloat(spiritLocked) * spiritPrice;
  const totalSpiritLockedUSD = totalSpiritLocked * spiritPrice;
  const totalDistributionUSD = +lastSpiritDistribution * spiritPrice;

  return {
    spiritPrice,
    balance,
    spiritLocked,
    spiritLockedValue,
    totalSpiritLocked,
    spiritPerInspirit,
    lastSpiritDistribution,
    totalDistributionUSD,
    totalSpiritLockedUSD,
    statisticsFromTimestamp,
    nextSpiritDistribution,
    spiritClaimable,
    bribesClaimable,
    lockedEnd,
    aprValue,
    averageSpiritUnlockTime,
  };
};

export const GetLimitOrders = () => {
  const userLimitOrders = useAppSelector(selectLimitOrders);

  return userLimitOrders;
};

export const GetFarms = () => {
  const boosted = useAppSelector(selectSaturatedGauges);

  return boosted;
};

export const getChartUrl = ({
  pairAddress,
  inTokenAddress,
  outTokenAddress,
  currency,
}: ChartProps) => {
  let url = '';
  const defaultUrl = `https://kek.tools/t/${WFTM.address}/chart?pair=0x30748322B6E34545DBe0788C421886AEB5297789&exchange=spiritswap&accent=101726&background=101726&theme=dark&currencyToggle=off&currencyType=${currency}&fallback=
  ${SPIRIT.address}`;

  if (inTokenAddress && outTokenAddress) {
    const inputAddress =
      inTokenAddress === BASE_TOKEN_ADDRESS ? WFTM.address : inTokenAddress;
    const outputAddress =
      outTokenAddress === BASE_TOKEN_ADDRESS ? WFTM.address : outTokenAddress;

    url = `https://kek.tools/t/${outputAddress}/chart?pair=${pairAddress}&exchange=spiritswap&accent=101726&background=101726&theme=dark&currencyToggle=off&currencyType=${currency}&fallback=
    ${inputAddress}`;
  } else return defaultUrl;

  return url;
};

export const getLpAddress = (
  outTokenAddress: string,
  inTokenAddress: string,
  chainID = CHAIN_ID,
) => {
  const inputAddress =
    inTokenAddress === BASE_TOKEN_ADDRESS
      ? WFTM.address.toLowerCase()
      : inTokenAddress.toLowerCase();
  const outputAddress =
    outTokenAddress === BASE_TOKEN_ADDRESS
      ? WFTM.address.toLowerCase()
      : outTokenAddress.toLowerCase();

  const lpFound = FARM.find(farm => {
    const quoteTokenAddress = farm.quoteTokenAdresses[chainID].toLowerCase();
    const tokenAddress = farm.tokenAddresses[chainID].toLowerCase();

    const condition1 =
      inputAddress === quoteTokenAddress || inputAddress === tokenAddress;

    const condition2 =
      outputAddress === quoteTokenAddress || outputAddress === tokenAddress;

    return condition1 && condition2;
  });

  if (lpFound) return lpFound.lpAddresses[chainID];
  else return undefined;
};

export const getFarmFromLp = (
  lpAddress: string,
  chainID = CHAIN_ID,
): FarmConfig | undefined => {
  const farmV1Found = farms.find(farm => {
    const wlLpAddress = farm.lpAddresses[chainID];
    return wlLpAddress === lpAddress;
  });

  const farmV1BoostedFound = farmsV2.find(farm => {
    const wlLpAddress = farm.lpAddresses[chainID];
    return wlLpAddress === lpAddress;
  });
  // giving priority to boosted farms
  if (farmV1BoostedFound) return farmV1BoostedFound;
  if (farmV1Found) return farmV1Found;
  else return undefined;
};

export const checkAddress = (valueA: string, valueB: string): boolean =>
  valueA?.toLowerCase() === valueB?.toLowerCase();

export const isFTM = (address: string): boolean =>
  checkAddress(address, BASE_TOKEN_ADDRESS);

export const isVerifiedToken = (tokenAddress: string) => {
  let addressToFind = '';
  if (tokenAddress === BASE_TOKEN_ADDRESS) {
    addressToFind = WFTM.address;
  }
  addressToFind = tokenAddress;

  return !!tokens.find(
    token => token.address?.toLowerCase() === addressToFind?.toLowerCase(),
  );
};

export const getLPSymbolFromSymbols = (arrayOfSymbols: string[]) => {
  let response = '';
  if (arrayOfSymbols?.length > 0) {
    response = arrayOfSymbols[0];
    for (let index = 1; index < arrayOfSymbols.length; index++) {
      response += `-${arrayOfSymbols[index]}`;
    }
    response += ' LP';
  }
  return response;
};

export const checkInvalidValue = (value: string) => {
  if (!isFinite(+value) || isNaN(+value)) return '0';
  return value;
};

export const formatUSDAmount = (value: number, symbol: string = ''): string => {
  if (!value) return `${symbol}${value}`;
  if (value < 0.01) return `<${symbol}0.01`;
  return `${symbol}${formatNumber({ value })}`;
};

export const getUserFarms = (farms: BoostedFarm[], userFarms) => {
  if (!userFarms || !farms) return [];
  const userArray = Object.entries(userFarms);

  const userFarmsOnly = farms.filter(e => {
    const address = e.fulldata.farmAddress;
    let findInd = userArray.findIndex(a => {
      return checkAddress(a[0], address);
    });
    return findInd !== -1;
  });
  return userFarmsOnly;
};

enum Days {
  sunday = 7,
  saturday = 6,
  friday = 5,
  thursday = 4,
  wednesday = 3,
  tuesday = 2,
  monday = 1,
}

export const getDaysUntilFriday = (date: moment.Moment) => {
  const dayOfWeek: number = date.isoWeekday();
  const hours = date.hours();
  const seconds = date.seconds();

  if (dayOfWeek === Days.monday) return date.add(4, 'days').startOf('day');
  if (dayOfWeek === Days.tuesday) return date.add(3, 'days').startOf('day');
  if (dayOfWeek === Days.wednesday) return date.add(2, 'days').startOf('day');
  if (dayOfWeek === Days.thursday) return date.add(1, 'days').startOf('day');
  if (dayOfWeek === Days.friday) {
    if (hours > 0 || (hours === 0 && seconds > 1)) {
      return date.add(1, 'week').startOf('day');
    }
    return date.startOf('day');
  }
  if (dayOfWeek === Days.saturday) return date.add(6, 'days').startOf('day');
  if (dayOfWeek === Days.sunday) return date.add(5, 'days').startOf('day');
  return date.startOf('day');
};
