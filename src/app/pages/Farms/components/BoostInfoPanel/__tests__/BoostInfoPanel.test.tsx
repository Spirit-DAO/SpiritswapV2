import { render } from '@testing-library/react';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';
import { BoostInfoPanel } from 'app/pages/Farms/components/BoostInfoPanel';
import { mockUseTranslation } from 'mocks/i18nForTests';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe('<BoostInfoPanel />', () => {
  const props = {
    boostFactor: '1.70',
    yourApr: 73.33,
    holdAmountForBoost: 43454.34,
    holdAmountForBoostFactor: 2.5,
    progress: 45,
  };

  const renderComponent = props =>
    render(
      <ChakraThemeWrapper>
        <ThemeWrapper>
          <BoostInfoPanel {...props} />
        </ThemeWrapper>
      </ChakraThemeWrapper>,
    );

  it('should render and match the snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });

  it('should show correct APR', () => {
    const { getAllByTestId } = renderComponent(props);
    const elements = getAllByTestId('TokenEarningsBox');
    const aprElem = elements.find(elem => elem.innerHTML.includes('Your APR'));
    expect(aprElem).toContainHTML(String(props.yourApr));
  });

  it('should show correct Boost Factor', () => {
    const { getAllByTestId } = renderComponent(props);
    const elements = getAllByTestId('TokenEarningsBox');
    const aprElem = elements.find(elem =>
      elem.innerHTML.includes('Your Boost Factor'),
    );
    expect(aprElem).toContainHTML(String(props.boostFactor));
  });

  it('should show correct message', () => {
    const { getByText } = renderComponent(props);
    const element = getByText('farms.boostInfoPanel.holdLabel');
    expect(element).toBeDefined();
  });
});
