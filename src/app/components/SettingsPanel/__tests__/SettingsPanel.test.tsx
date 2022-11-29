import { render, fireEvent } from '@testing-library/react';
import { createRenderer } from 'react-test-renderer/shallow';
import {
  SettingsPanel,
  SettingsPanelProps,
} from 'app/components/SettingsPanel';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

const renderer = createRenderer();
const renderComponent = (props: SettingsPanelProps) =>
  render(
    <ChakraThemeWrapper>
      <ThemeWrapper>
        <SettingsPanel {...props} />
      </ThemeWrapper>
    </ChakraThemeWrapper>,
  );

describe('<SettingsPanel />', () => {
  const props = {
    labels: ['0.1%', '0.5%', '1%', 'Auto'],
    selected: 0,
    timer: 20,
    custom: '',
    translationsPath: 'swap.settings',
  };

  it('should render and match the snapshot', () => {
    renderer.render(<SettingsPanel {...props} />);
    const renderedOutput = renderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });

  it('should update slippage value on custom input', () => {
    const { getByTestId } = renderComponent(props);
    fireEvent.change(getByTestId('slippage-tolerance-custom'), {
      target: { value: '90%' },
    });
    const element = getByTestId('slippage-tolerance-value');
    expect(element.textContent).toEqual('90%');
  });

  it('should handle back action event', () => {
    const handleClick = jest.fn();
    const { getByTestId } = renderComponent({
      ...props,
      backAction: handleClick,
    });
    fireEvent.click(getByTestId('back-action'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('should reset value', () => {
    const { getByTestId } = renderComponent(props);
    fireEvent.change(getByTestId('slippage-tolerance-custom'), {
      target: { value: '90%' },
    });
    const element = getByTestId('slippage-tolerance-value');
    expect(element.textContent).toEqual('90%');
    fireEvent.click(getByTestId('reset-action'));
    expect(element.textContent).toEqual('0.1%');
  });

  it('should show selected value from <SlippageTolerance /> component', () => {
    const { getByTestId, getByText } = renderComponent(props);
    fireEvent.click(getByText('1%'));
    const element = getByTestId('slippage-tolerance-value');
    expect(element.textContent).toEqual('1%');
  });
});
