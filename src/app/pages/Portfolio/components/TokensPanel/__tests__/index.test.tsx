import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'store';
import ThemeProvider from '../../../../../../theme';

import { act } from 'react-dom/test-utils';
import TokensPanel from '../TokensPanel';
import { i18n } from 'locales/i18n';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';

describe('TokensPanel-Component', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    cleanup();
  });

  const dataTest = {
    tokenList: [],
    farmList: [],
    diffAmount: '',
    diffAmountValue: 0,
    diffPercent: '',
    diffPercentValue: 0,
    totalValue: '',
    total24Value: '',
    totalValueNumber: 0,
    total24ValueNumber: 0,
  };

  xit('renders without crashing and without values', async () => {
    const t = await i18n;

    expect(t).toBeDefined();
    act(() => {
      render(
        <ChakraThemeWrapper>
          <ThemeProvider>
            <Provider store={store}>
              <React.StrictMode>
                <TokensPanel tokensData={dataTest} />
              </React.StrictMode>
            </Provider>
          </ThemeProvider>
        </ChakraThemeWrapper>,
        container,
      );
    });
  });

  it('renders without crashing and with values', () => {
    act(() => {
      render(
        <ChakraThemeWrapper>
          <ThemeProvider>
            <Provider store={store}>
              <React.StrictMode>
                <TokensPanel tokensData={dataTest} />
              </React.StrictMode>
            </Provider>
          </ThemeProvider>
        </ChakraThemeWrapper>,
        container,
      );
    });
  });
});
