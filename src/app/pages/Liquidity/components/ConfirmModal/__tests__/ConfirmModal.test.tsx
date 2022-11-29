import { render } from '@testing-library/react';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { store } from 'store';
import { Provider } from 'react-redux';
import { ConfirmModal } from '..';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

const onCancel = () => {};
const onConfirm = () => {};

const parsedAmounts = {
  SPIRIT: 1000,
  WBTC: 2000,
};

const Component = () => {
  return (
    <ChakraThemeWrapper>
      <ThemeWrapper>
        <Provider store={store}>
          <ConfirmModal
            onCancel={onCancel}
            onConfirm={onConfirm}
            sharePool={0.003}
            parsedAmounts={parsedAmounts}
            price={'4000'}
            setZapDirectly={() => {}}
            zapDirectly={false}
          />
        </Provider>
      </ThemeWrapper>
    </ChakraThemeWrapper>
  );
};

describe('Confirm Modal component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Component />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should render and match snapshot', () => {
    const { container } = render(<Component />);
    expect(container).toMatchSnapshot();
  });
});
