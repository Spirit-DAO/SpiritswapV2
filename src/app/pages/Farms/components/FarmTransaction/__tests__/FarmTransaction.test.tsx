import { render } from '@testing-library/react';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { FarmTransaction } from 'app/pages/Farms/components/FarmTransaction/index';
import { queryClient } from 'config/queryClient';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { store } from 'store';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe('<FarmTransaction />', () => {
  const props = {
    farm: {},
  };
  const renderComponent = props =>
    render(
      <ThemeWrapper>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <FarmTransaction {...props} />
          </Provider>
        </QueryClientProvider>
      </ThemeWrapper>,
    );

  it('should render and match snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });
});
