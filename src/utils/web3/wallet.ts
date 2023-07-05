import { BigNumber, ethers, PopulatedTransaction } from 'ethers';
import { NETWORK, CHAIN_ID } from 'constants/index';
import { EthereumChainParameter } from './types';
import { getProvider } from 'app/connectors/EthersConnector/login';

const { error } = console;

// Adds a network on your wallet or switches to that network if the wallet is on a different network
// Our default network is going to be Fantom
export const setupNetwork = async (chainId = CHAIN_ID) => {
  const provider = await getProvider();
  const chain = NETWORK[chainId];

  if (provider) {
    const networkConfig: EthereumChainParameter = {
      chainId: `0x${chain.hex}`,
      chainName: chain.network,
      nativeCurrency: {
        name: chain.name,
        symbol: chain.symbol,
        decimals: chain.decimals,
      },
      rpcUrls: NETWORK[chainId].rpc,
      blockExplorerUrls: NETWORK[chainId].blockExp,
    };
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chain.hex}` }],
      });
    } catch (e: any) {
      if (e.code === 4902) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
      } else {
        error(e);
      }
    }
  } else {
    error(`Can't setup the ${chain.network} network because no wallet exists`);
  }
};

// Registers an ERC20 token to your wallet
export const registerToken = (
  _address: string,
  _symbol: string,
  _decimals: number,
  _image?: string,
  _type = 'ERC20',
) => {
  // Returns promise
  return window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: _type,
      options: {
        address: _address,
        symbol: _symbol,
        decimals: _decimals,
        image: _image,
      },
    },
  });
};

export const sendTransaction = async (
  from: string,
  to: string,
  value: string,
  library,
) => {
  if (window.ethereum?.request) {
    try {
      const amount = BigNumber.from(value).toHexString();
      const response = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from, to, value: amount }],
      });

      const tx = await library.getTransaction(response);

      return tx;
    } catch (e) {
      return console.error(e);
    }
  }
};

export const sendTransactionV2 = async (transaction: PopulatedTransaction) => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const tx = await signer.sendTransaction(transaction);
    return tx;
  }
};

// event names per provider
export const eventNames = {
  default: ['accountsChanged', 'chainChanged', 'connect', 'disconnect'],
};

export const listenForWalletEvents = async (_callback: Function) => {
  const _connector = await getProvider();
  const events = eventNames[_connector] || eventNames.default;
  const walletLocation = _connector;

  removeWalletListeners();

  if (walletLocation) {
    events.forEach(ev => {
      walletLocation.on(ev, () => {
        _callback(ev);
      });
    });
  }

  return walletLocation;
};

export const removeWalletListeners = async (_callback = () => null) => {
  const _connector = await getProvider();
  const events = eventNames[_connector] || eventNames.default;
  const walletLocation = _connector;

  if (walletLocation) {
    events.forEach(ev => {
      walletLocation.removeListener(ev, _callback);
    });
  }

  return walletLocation;
};
