import { render } from '@testing-library/react';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from 'store';
import { Farms } from 'app/pages/Farms';
import { mockUseTranslation } from 'mocks/i18nForTests';
import ThemeProvider from 'theme';
import { ChakraThemeProvider } from 'theme/chakra';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe('<Farms />', () => {
  const props = {};
  const renderComponent = props =>
    render(
      <ChakraThemeProvider>
        <ThemeProvider>
          <ThemeWrapper>
            <HelmetProvider>
              <Provider store={store}>
                <Farms {...props} />
              </Provider>
            </HelmetProvider>
          </ThemeWrapper>
        </ThemeProvider>
      </ChakraThemeProvider>,
    );

  it('should render and match snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });
});
