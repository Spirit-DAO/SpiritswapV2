import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  memo,
} from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { Web3TxData } from 'utils/web3';
import { useProgressToast } from 'app/hooks/Toasts/useProgressToast';
import { useSuggestion } from 'app/hooks/Suggestions/useSuggestion';
import { CHAIN_ID, NOTIFICATIONS_STATE } from 'constants/index';
import { DataContext } from 'contexts/DataContext';
import useLogin, { getProvider } from './login';
import { resetUserStatistics } from 'store/user';
import { useToast } from '@chakra-ui/react';
import { WorkerCall } from 'types';
import useWallets from 'app/hooks/useWallets';
import getNotificationIcon from '../getNotificationIcon';
import { selectAddress, selectPendingTransactions } from 'store/user/selectors';

const EthersConnector = ({ children }) => {
  const toast = useToast();
  const { isLoggedIn } = useWallets();
  const { handleLogin } = useLogin();
  const dispatch = useAppDispatch();
  const { showToast } = useProgressToast();
  const { showSuggestion } = useSuggestion();

  const account = useAppSelector(selectAddress);

  const [provider, setProvider] = useState<any>();

  const pending = useAppSelector(selectPendingTransactions);
  const { dataWorker, userDataWorker } = useContext(DataContext);
  const [inQueue, setInQueue] = useState<{ [key: string]: Web3TxData }>({});

  useEffect(() => {
    const connectWallet = async () => {
      const provider = await getProvider();
      setProvider(provider);
    };

    connectWallet();
  }, [account]);

  const page = useMemo(() => {
    const { pathname } = window.location;
    let page = /\/(.*?)\//g.exec(pathname) || [];
    if (!page || !page[1]) {
      page = /\/(.*?)$/g.exec(pathname) || [];
    }

    return page[1].toLowerCase();
  }, []);

  const pageData = useMemo(() => {
    return {
      home: ['getSpiritStatistics'],
      farms: ['getFarms', 'getV3Liquidity'],
      spiritwars: ['getSpiritWarsData'],
      inspirit: ['getBoostedGauges'],
    };
  }, []);

  const pageUserData = useMemo(() => {
    return {
      home: ['updatePortfolioData'],
      swap: ['checkLimitOrders', 'checkAllowances'],
    };
  }, []);

  const fetchAppData = useCallback(async () => {
    const calls: WorkerCall[] = [];

    // Prioritize the page we are on
    Object.keys(pageData).forEach(pageKey => {
      if (pageKey === page) {
        pageData[pageKey].forEach(async data => {
          dataWorker.postMessage({
            type: data,
            network: CHAIN_ID,
            isLoggedIn,
          });
        });
      } else {
        // Add it to the queue for later
        pageData[pageKey].forEach(data => {
          calls.push({
            type: data,
            network: CHAIN_ID,
            isLoggedIn,
          });
        });
      }
    });

    // Fetch the rest of the data

    calls.forEach(async call => {
      dataWorker.postMessage(call);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, account, dataWorker]);

  const fetchUserData = useCallback(async () => {
    const calls: WorkerCall[] = [];

    Object.keys(pageUserData).forEach(pageKey => {
      if (pageKey === page) {
        pageUserData[pageKey].forEach(data => {
          userDataWorker.postMessage({
            userAddress: account,
            type: data,
            network: CHAIN_ID,
          });
        });
      } else {
        // Add it to the queue for later
        pageUserData[pageKey].forEach(data => {
          calls.push({
            userAddress: account,
            type: data,
            network: CHAIN_ID,
          });
        });
      }
    });

    // Fetch the rest of the data
    calls.forEach(async call => {
      userDataWorker.postMessage(call);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, account, userDataWorker]);

  useEffect(() => {
    fetchAppData();
    if (isLoggedIn) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAppData, fetchUserData]);

  useEffect(() => {
    if (provider) {
      provider.on('accountsChanged', async () => {
        dispatch(resetUserStatistics());
        handleLogin();
        fetchUserData();
      });
    }

    return () => {
      if (provider) {
        provider.removeListener('accountsChanged', () => {});
      }
    };
  }, [dispatch, fetchUserData, handleLogin, provider]);

  const removeFromQueue = (hash: string) => {
    const inQueueCopy = { ...inQueue };

    Object.keys(inQueueCopy).forEach(key => {
      if (inQueueCopy[key].hash === hash) {
        delete inQueueCopy[key];
      }
    });

    setInQueue(inQueueCopy);
  };

  const addToQueue = (hash: string, params: Web3TxData) => {
    setInQueue({
      ...inQueue,
      [hash]: params,
    });
  };

  const transactionCallback = async (
    params: Web3TxData,
    receiptPromise: Promise<any>,
  ) => {
    const {
      hash,
      successTitle,
      errorTitle,
      actionType,
      suggestionData,
      inputSymbol,
      outputSymbol,
      inputValue,
      uniqueMessage,
      outputValue,
      link,
    } = params;

    const receipt = await receiptPromise;

    toast.close(params.hash);
    showToast({
      title: receipt.status ? successTitle : errorTitle,
      id: receipt.status ? `confirmed-${hash}` : `failed-${hash}`,
      type: receipt.status
        ? NOTIFICATIONS_STATE.SUCCESS
        : NOTIFICATIONS_STATE.ERROR,
      inputSymbol,
      inputValue,
      uniqueMessage,
      outputSymbol,
      outputValue,
      duration: 5000,
      icon: getNotificationIcon(actionType || ''),
      link,
    });

    fetchUserData();

    if (suggestionData && receipt.status) {
      showSuggestion({
        id: `${suggestionData.id}-suggestion`,
        type: suggestionData?.type,
        data: suggestionData?.data ?? {},
      });
    }
  };

  // Handle pending tx
  useEffect(() => {
    pending.forEach(({ hash }) => {
      if (!hash || inQueue[hash]) return;

      const match = pending.find(
        transaction => `${transaction.hash}` === `${hash}`,
      );

      if (match) {
        addToQueue(hash, match);
      }
    });

    Object.keys(inQueue).forEach(hash => {
      if (!hash) return;

      const receiptPromise = provider!.getTransactionReceipt(hash);

      const match = pending.find(
        transaction => `${transaction.hash}` === `${hash}`,
      );

      if (inQueue[hash] && !match) {
        transactionCallback(inQueue[hash], receiptPromise);
        removeFromQueue(hash);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, inQueue]);

  return <>{children}</>;
};

export default memo(EthersConnector);
