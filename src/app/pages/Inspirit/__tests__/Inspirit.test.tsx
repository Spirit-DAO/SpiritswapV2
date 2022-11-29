import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { HelmetProvider } from 'react-helmet-async';
import { store } from 'store';
import { InspiritPage as Inspirit } from 'app/pages/Inspirit';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { ChakraThemeWrapper } from '../../../components/shared/testing/ChakraTheme';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { queryClient } from 'config/queryClient';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe('<Inspirit />', () => {
  const props = {};
  const renderComponent = props =>
    render(
      <MemoryRouter>
        <ChakraThemeWrapper>
          <ThemeWrapper>
            <HelmetProvider>
              <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                  <Inspirit {...props} />
                </QueryClientProvider>
              </Provider>
            </HelmetProvider>
          </ThemeWrapper>
        </ChakraThemeWrapper>
      </MemoryRouter>,
    );

  xit('should render and match snapshot', () => {
    const component = renderComponent(props);
    // TODO: Snapshot fails cause one of the props is a date.
    // Need to update testing suite to account of this
    // expect(component).not.toMatchSnapshot();
    expect(component).toMatchSnapshot();
  });
});
