import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from 'app';
import { HelmetProvider } from 'react-helmet-async';
import reportWebVitals from './reportWebVitals';
import { store } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'sanitize.css/sanitize.css';
import './locales/i18n';
import './theme/chakra/globalStyles.css';
import EthersConnector from 'app/connectors/EthersConnector';
import ThemeProvider from './theme';
import { ChakraThemeProvider } from './theme/chakra';
import { QueryClientProvider } from 'react-query';
import { queryClient } from 'config/queryClient';
import { ReactQueryDevtools } from 'react-query/devtools';
import { DataContextProvider } from 'contexts/DataContext';

const MOUNT_NODE = document.getElementById('root') as HTMLElement;
const root = createRoot(MOUNT_NODE);

declare global {
  interface Window {
    ethereum: any;
  }
}

let persistor = persistStore(store);

root.render(
  <ChakraThemeProvider>
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <DataContextProvider>
              <HelmetProvider>
                <EthersConnector>
                  <App />
                </EthersConnector>
              </HelmetProvider>
              <ReactQueryDevtools />
            </DataContextProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </ChakraThemeProvider>,
);

if (module.hot) {
  module.hot.accept(['./locales/i18n'], () => {
    // No need to render the App again because i18next works with the hooks
  });
}

reportWebVitals();
