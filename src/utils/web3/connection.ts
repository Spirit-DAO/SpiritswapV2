import { ethers } from 'ethers';
import { NETWORK, CHAIN_ID } from 'constants/index';
import {
  CONNECTIONS,
  walletConnectProvider,
} from 'app/connectors/EthersConnector/login';
import WalletConnectProvider from '@walletconnect/web3-provider';

const providers = {};
const signers = {};

// Creates a basic connection to the blockchain through a wallet such as metamask
export const wallet = async (
  _connection,
  _chainId = CHAIN_ID,
  _connect?: Function,
) => {
  // TODO: Add network connection is chainId id is not connected
  /*const { ethereum } = window;

  if (!ethereum) {
    return {
      notInstalled: true,
    };
  } */

  const provider = new ethers.providers.Web3Provider(_connection, {
    name: NETWORK[_chainId].network,
    chainId: _chainId,
  });

  const accounts = await provider.listAccounts();

  if (!accounts.length && !_connect) {
    return {
      notLoggedIn: true,
    };
  }

  const signer = await provider.getSigner();

  if (_connect) {
    if (![walletConnectProvider].includes(_connection)) {
      await provider.send('eth_requestAccounts', []);
    }
    return _connect(signer);
  }

  return {
    provider,
    signer,
  };
};

const randomInt_0_to_2 = () => {
  return Math.floor(Math.random() * 3);
};

// Connects to either a wallet or external rpc
export const connect = async ({
  _connection = 'rpc',
  _callback,
  _chainId = CHAIN_ID,
  rpcID = 0,
}: {
  _connection?: any;
  _callback?: Function;
  _chainId?: number;
  rpcID?: number;
}) => {
  if (CONNECTIONS().includes(_connection)) {
    try {
      if (_connection instanceof WalletConnectProvider) {
        await _connection.enable();
      }
      return wallet(_connection, _chainId, _callback);
    } catch (error) {}
  }

  let connectionUrl = _connection;

  if (connectionUrl === 'rpc') {
    const chainID = _chainId !== 0 ? _chainId : CHAIN_ID;
    const chain = NETWORK[chainID];
    connectionUrl = chain.rpc[randomInt_0_to_2()];
  }

  if (!providers[connectionUrl]) {
    providers[connectionUrl] = new ethers.providers.JsonRpcProvider(
      connectionUrl,
    );
  }

  if (!signers[connectionUrl]) {
    signers[connectionUrl] = providers[connectionUrl].getSigner();
  }

  return { provider: providers[connectionUrl], signer: signers[connectionUrl] };
};

export const web3Socket = (_chainId = CHAIN_ID) => {
  const chain = NETWORK[_chainId];
  const stream = new ethers.providers.WebSocketProvider(chain.wss[0]);
  return stream;
};

export const checkWalletConnection = async (
  _connector,
  _chainId = CHAIN_ID,
) => {
  const responseObject = {
    installed: false,
    connected: false,
    unlocked: false,
    signer: false,
  };

  if (!_connector) {
    return responseObject;
  }

  responseObject.installed = true;

  const { provider, signer } = await wallet(_connector);

  if (!provider) {
    return responseObject;
  }

  responseObject.connected = true;
  responseObject.unlocked = true;

  if (signer) {
    responseObject.signer = true;
  }

  return responseObject;
};
