import { render } from '@testing-library/react';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { TokenPanelModal } from '../index';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

const token = {
  name: 'SpiritSwap Token',
  symbol: 'SPIRIT',
  address: '0x5Cc61A78F164885776AA610fb0FE1257df78E59B',
  chainId: 250,
  decimals: 18,
};
const amounts = {
  SPIRIT: 1000,
};
const Component = () => {
  return (
    <ThemeWrapper>
      <TokenPanelModal token={token} amounts={amounts} />
    </ThemeWrapper>
  );
};

describe('OptionsDropdown component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Component />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should render and match snapshot', () => {
    const { container } = render(<Component />);
    expect(container).toMatchSnapshot();
  });
});
