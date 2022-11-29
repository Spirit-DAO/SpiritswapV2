import {
  listenToAppWorker,
  listenToUserworker,
} from 'app/connectors/EthersConnector/listeners/workerListener';
import useWallets from 'app/hooks/useWallets';
import React, { useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';

const dataWorker = new Worker(
  new URL('../workers/dataWorker.ts', import.meta.url),
);
const userDataWorker = new Worker(
  new URL('../workers/userDataWorker.ts', import.meta.url),
);

const DataContext = React.createContext({
  dataWorker,
  userDataWorker,
});

const DataContextProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useWallets();
  useEffect(() => {
    const appListener = listenToAppWorker(dataWorker, dispatch, isLoggedIn);
    const userListener = listenToUserworker(userDataWorker, dispatch);
    return () => {
      dataWorker.removeEventListener('message', appListener);
      userDataWorker.removeEventListener('message', userListener);
    };
  }, []);

  return (
    <DataContext.Provider value={{ dataWorker, userDataWorker }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataContextProvider };
