import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'store';
import { SwapPage as Swap } from 'app/pages/Swap';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { QueryClientProvider } from 'react-query';
import { queryClient } from 'config/queryClient';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe('<Swap />', () => {
  const props = {};
  const renderComponent = props =>
    render(
      <ChakraThemeWrapper>
        <ThemeWrapper>
          <HelmetProvider>
            <Provider store={store}>
              <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                  <Swap {...props} />
                </BrowserRouter>
              </QueryClientProvider>
            </Provider>
          </HelmetProvider>
        </ThemeWrapper>
      </ChakraThemeWrapper>,
    );

  it('should render and match snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });
});
