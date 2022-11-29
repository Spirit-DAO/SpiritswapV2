import { render } from '@testing-library/react';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from 'store';
import { BridgePage as Bridge } from 'app/pages/Bridge';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { QueryClientProvider } from 'react-query';
import { queryClient } from 'config/queryClient';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe('<Bridge />', () => {
  const props = {};
  const renderComponent = props =>
    render(
      <ThemeWrapper>
        <HelmetProvider>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <Bridge {...props} />
            </QueryClientProvider>
          </Provider>
        </HelmetProvider>
      </ThemeWrapper>,
    );

  xit('should render and match snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });
});
