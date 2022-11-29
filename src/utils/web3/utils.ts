import random from 'lodash/random';
import { ethers } from 'ethers';
import { ConnectorNames } from 'constants/index';
import { BigNumber } from './types';
import { tokenData } from 'utils/data/types';
import tokens from 'constants/tokens';
import { Token } from 'app/interfaces/General';

const { formatUnits, parseUnits } = ethers.utils;

// Formats ether amounts into readible format
export const formatFrom = (_amount: BigNumber, _decimals: number = 18) =>
  formatUnits(_amount, _decimals);

// Formats regular amounts into ether amounts
export const formatTo = (_amount: string, _decimals: number = 18) =>
  parseUnits(_amount, _decimals);

export const randomNode = (nodes: Array<string>) => {
  const randomIndex = random(0, nodes.length - 1);
  return nodes[randomIndex] || '';
};

export const formatPortfolioToWallet = (portfolio: tokenData[]) => {
  const wallet = {
    portfolio: {},
    rates: {},
  };

  portfolio?.forEach(token => {
    wallet.portfolio[token.symbol] = token.amount;
    wallet.rates[token.symbol] = token.rate || 0;
  });

  return wallet;
};

export const isCoin98Installed = () => {
  // @ts-ignore
  return !!(window?.ethereum?.isCoin98 || window?.coin98);
};

export const isMetamaskInstalled = () => {
  // @ts-ignore
  return !!window?.ethereum?.isMetaMask;
};

// coinbase
export const isWalletLinkInstalled = () => {
  // @ts-ignore
  return !!window?.ethereum?.scanQRCode;
};

export const isMathWalletInstalled = () => {
  // @ts-ignore
  return !!window?.ethereum?.isMathWallet;
};

export const getExtensionName = (connectorId: ConnectorNames) => {
  switch (connectorId) {
    case ConnectorNames.Injected:
      return 'MetaMask';
    case ConnectorNames.Coin98:
      return 'Coin98';
    case ConnectorNames.WalletLink:
      return 'CoinBase';
    case ConnectorNames.WalletConnect:
      return 'WalletConnect';
    case ConnectorNames.CloverWallet:
      return 'CloverWallet';
    case ConnectorNames.TrustWallet:
      return 'TrustWallet';
    default:
      return '';
  }
};

export const findToken = (filter: string, filterType = 'address') => {
  const match: Token[] = tokens.filter(token => {
    if (filterType === 'symbol') {
      return (
        `${filter}`.toLowerCase() === `${token.symbol}`.toLocaleLowerCase()
      );
    }

    return `${filter}`.toLowerCase() === `${token.address}`.toLocaleLowerCase();
  });

  return match[0];
};
