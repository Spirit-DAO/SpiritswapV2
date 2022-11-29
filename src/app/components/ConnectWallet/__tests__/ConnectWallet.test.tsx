import { render } from '@testing-library/react';
import { ConnectWallet } from 'app/components/ConnectWallet';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';
import { Provider } from 'react-redux';
import { store } from 'store';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe('<ConnectWallet />', () => {
  const props = {
    labels: {
      title: 'title',
      footer: 'footer',
    },
    walletsList: [],
  };
  const renderComponent = props =>
    render(
      <Provider store={store}>
        <ChakraThemeWrapper>
          <ConnectWallet {...props} />
        </ChakraThemeWrapper>
      </Provider>,
    );

  it('should render and match snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });
});
