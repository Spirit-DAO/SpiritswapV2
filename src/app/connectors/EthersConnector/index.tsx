import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { Web3Provider, connect, Web3TxData } from 'utils/web3';
import { useProgressToast } from 'app/hooks/Toasts/useProgressToast';
import { getCircularReplacer } from 'app/utils';
import { useSuggestion } from 'app/hooks/Suggestions/useSuggestion';
import { CHAIN_ID, NOTIFICATIONS_STATE } from 'constants/index';
import { ethers } from 'ethers';
import { DataContext } from 'contexts/DataContext';
import useLogin from './login';
import user, { resetUserStatistics } from 'store/user';
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
  const pending = useAppSelector(selectPendingTransactions);

  const { dataWorker, userDataWorker } = useContext(DataContext);

  const [inQueue, setInQueue] = useState<{ [key: string]: Web3TxData }>({});

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
      farms: ['getFarms'],
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

  const initProvider = useCallback(async ({ rpcId }: { rpcId?: number }) => {
    console.log(rpcId, 'aca');

    const { provider: currentProvider, signer: currentSigner } = await connect({
      rpcID: rpcId,
    });

    return [currentProvider, currentSigner];
  }, []);

  const fetchAppData = useCallback(async () => {
    const [currentProvider] = await initProvider({ rpcId: 1 });

    const _provider = JSON.stringify(currentProvider, getCircularReplacer());
    // const calls: WorkerCall[] = [];

    // Prioritize the page we are on
    Object.keys(pageData).forEach(pageKey => {
      if (pageKey === page) {
        pageData[pageKey].forEach(async data => {
          dataWorker.postMessage({
            type: data,
            network: currentProvider!._network,
            provider: _provider,
            isLoggedIn,
          });
        });
      }
    });
    // else {
    //   // Add it to the queue for later
    //   pageData[pageKey].forEach(data => {
    //     calls.push({
    //       type: data,
    //       network: currentProvider!._network,
    //       provider: _provider,
    //       isLoggedIn,
    //     });
    //   });
    // }

    // // Fetch the rest of the data
    // calls.forEach(async call => {
    //   try {
    //     dataWorker.postMessage(call);
    //   } catch (e) {
    //     console.error(e);
    //   }
    // });
  }, [dataWorker, initProvider, isLoggedIn, page, pageData]);

  const fetchUserData = useCallback(async () => {
    // let currentProvider = provider;
    // let currentSigner = signer;
    // if (!currentProvider || !currentSigner) {
    const randomInt_0_to_4 = () => {
      return Math.floor(Math.random() * 4) + 1;
    };

    const [currentProvider, currentSigner] = await initProvider({
      rpcId: randomInt_0_to_4(),
    });
    // }

    console.log();

    const signerJson = JSON.stringify(currentSigner, getCircularReplacer());
    // const calls: WorkerCall[] = [];

    const _provider = JSON.stringify(currentProvider, getCircularReplacer());

    Object.keys(pageUserData).forEach(pageKey => {
      if (pageKey === page) {
        pageUserData[pageKey].forEach(data => {
          userDataWorker.postMessage({
            userAddress: account,
            type: data,
            signer: signerJson,
            provider: _provider,
          });
        });
      }
    });
    // else {
    //   // Add it to the queue for later
    //   pageUserData[pageKey].forEach(data => {
    //     calls.push({
    //       userAddress: account,
    //       type: data,
    //       signer: signerJson,
    //       provider: _provider,
    //     });
    //   });
    // }

    // Fetch the rest of the data
    // calls.forEach(async call => {
    //   try {
    //     userDataWorker.postMessage(call);
    //   } catch (e) {}
    // });
  }, [account, initProvider, page, pageUserData, userDataWorker]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async () => {
        dispatch(resetUserStatistics());
        handleLogin();
        fetchUserData();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, [dispatch, fetchUserData, handleLogin]);

  useEffect(() => {
    console.log('START - FERCHING DATA APP');

    fetchAppData();

    if (account) {
      console.log('START - FERCHING DATA USER');

      fetchUserData();
    }
  }, [fetchAppData, fetchUserData, account]);

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
      const provider = window.ethereum
        ? new ethers.providers.Web3Provider(window.ethereum, 'any')
        : undefined;
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

  // useEffect(() => {
  //   const unionFetch = () => {
  //     console.log('fetching data unionFetch');

  //     // fetchAppData();
  //     if (isLoggedIn) {
  //       console.log('fetching data unionFetch isLoggedIn');

  //       fetchUserData();
  //     }
  //   };

  //   const intervalId = setInterval(() => {
  //     //assign interval to a variable to clear it.
  //     unionFetch();
  //   }, 45000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [fetchAppData, fetchUserData, isLoggedIn]);

  return <>{children}</>;
};

export default EthersConnector;
