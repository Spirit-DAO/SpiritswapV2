import { useState, useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { setAddress, resetUserStatistics } from 'store/user';
import safeExecute from 'utils/safeExecute';
import { connect } from 'utils/web3';
import { ConnectorNames, NETWORK } from 'constants/index';
import { setupNetwork } from 'utils/web3';
import { EthereumProvider } from '@walletconnect/ethereum-provider';

declare global {
  interface Window {
    coin98: any;
    clover: any;
  }
}

export const CONNECTIONS = () => {
  if (self.window) {
    return [window.ethereum, 'walletconnect'];
  } else {
    return [];
  }
};

export const providersByConnectorName = async connector => {
  if (!self.window) {
    return null;
  }

  if (connector === ConnectorNames.WalletConnect) {
    const walletConnectProvider = await EthereumProvider.init({
      projectId: 'dc6366545a484b88d4aa04399932a3a9',
      chains: [250],
      rpcMap: {
        250: NETWORK[250].rpc[0],
      },
      showQrModal: true,
    });
    return walletConnectProvider;
  } else {
    return window.ethereum;
  }
};

export const getProvider = async () => {
  const connector =
    localStorage.getItem('CONNECTOR') || ConnectorNames.Injected;

  return await providersByConnectorName(connector);
};

const useLogin = () => {
  const [isLoggedIn, setLoggedIn] = useState<boolean>();

  const dispatch = useAppDispatch();

  const updateLogin = useCallback(
    async (_signer, _login = false) => {
      try {
        if (_login) {
          setupNetwork();
          const address = await _signer.getAddress();
          dispatch(setAddress(address));
          setLoggedIn(true);
        } else {
          dispatch(setAddress(null));
          setLoggedIn(false);
          localStorage.setItem('CONNECTOR', '');
          dispatch(resetUserStatistics());
        }
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch, setLoggedIn],
  );

  const connectWallet = useCallback(
    (_connector = localStorage.getItem('CONNECTOR') || '') => {
      safeExecute(async () => {
        // This is the user's wallet. ConnectorNames represent the plugin used

        let localConnector;
        if (_connector === ConnectorNames.Coin98) {
          localConnector = window.coin98?.provider;
        }
        if (_connector === ConnectorNames.CloverWallet) {
          localConnector = window.clover;
        }
        if (_connector === ConnectorNames.WalletConnect) {
          const walletConnectProvider = await EthereumProvider.init({
            projectId: 'dc6366545a484b88d4aa04399932a3a9',
            chains: [250],
            rpcMap: {
              250: NETWORK[250].rpc[0],
            },
            showQrModal: true,
          });

          localConnector = walletConnectProvider;
        }

        if (!localConnector) {
          localConnector = window.ethereum;
        }

        localStorage.setItem('CONNECTOR', _connector);

        connect({
          _connection: localConnector,
          _callback: _signer => updateLogin(_signer, true),
        });
      });
    },
    [updateLogin],
  );

  const handleLogout = () => updateLogin(undefined);
  const handleLogin = (
    _connector: ConnectorNames = ConnectorNames.Injected,
  ) => {
    connectWallet(_connector);
  };

  const refreshWallet = (
    _connector: ConnectorNames = ConnectorNames.Injected,
  ) => connectWallet(_connector);

  return {
    isLoggedIn,
    handleLogin,
    handleLogout,
    refreshWallet,
    _connector: localStorage.getItem('CONNECTOR') || '',
  };
};

export default useLogin;
