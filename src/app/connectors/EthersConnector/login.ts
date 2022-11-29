import { useState, useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { setAddress, resetUserStatistics } from 'store/user';
import safeExecute from 'utils/safeExecute';
import { connect } from 'utils/web3';
import { ConnectorNames, CHAIN_ID, REACT_APP_NODE_1 } from 'constants/index';
import { setupNetwork } from 'utils/web3';
import WalletConnectProvider from '@walletconnect/web3-provider';

declare global {
  interface Window {
    coin98: any;
    clover: any;
  }
}

export const walletConnectProvider = new WalletConnectProvider({
  rpc: { [CHAIN_ID]: `${REACT_APP_NODE_1}` },
  chainId: CHAIN_ID,
});

export const CONNECTIONS = () => {
  if (self.window) {
    return [window.ethereum, walletConnectProvider];
  } else {
    return [];
  }
};

export const providersByConnectorName = connector => {
  if (!self.window) {
    return null;
  }

  if (connector === ConnectorNames.WalletConnect) {
    return walletConnectProvider;
  } else {
    return window.ethereum;
  }
};

export const getProvider = () => {
  const connector =
    localStorage.getItem('CONNECTOR') || ConnectorNames.Injected;
  return providersByConnectorName(connector);
};

const useLogin = () => {
  const [isLoggedIn, setLoggedIn] = useState<boolean>();

  const dispatch = useAppDispatch();

  const updateLogin = useCallback(
    async (_signer, _login = false) => {
      if (_login) {
        setupNetwork();
        const address = await _signer.getAddress();
        dispatch(setAddress(address));
        setLoggedIn(true);
      } else {
        if (walletConnectProvider.connected) {
          walletConnectProvider.disconnect();
        }
        dispatch(setAddress(null));
        setLoggedIn(false);
        localStorage.setItem('CONNECTOR', '');
        dispatch(resetUserStatistics());
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
          localConnector = walletConnectProvider;
        }

        if (!localConnector) {
          localConnector = window.ethereum;
        }

        localStorage.setItem('CONNECTOR', _connector);

        connect(localConnector, _signer => updateLogin(_signer, true));
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
