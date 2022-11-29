import React from 'react';
import ReactDOM from 'react-dom';
import Trading from '../Trading';
import { render, cleanup } from '@testing-library/react';
import ThemeProvider from 'theme';
import renderer from 'react-test-renderer';
import { i18n } from 'locales/i18n';
import { act } from 'react-dom/test-utils';
import { Props as TradingProps } from '../Trading.d';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';

describe('Trading-Component', () => {
  let container;
  const { act: rendererAct, create } = renderer;
  const TradingComponent = ({ ...props }: TradingProps) => {
    return (
      <ChakraThemeWrapper>
        <ThemeProvider>
          <React.StrictMode>
            <Trading {...props} />
          </React.StrictMode>
        </ThemeProvider>
      </ChakraThemeWrapper>
    );
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    cleanup();
  });

  it('should initiate i18n', async () => {
    const t = await i18n;
    expect(t).toBeDefined();
  });

  it('render without crashing and without values', () => {
    act(() => {
      ReactDOM.render(<TradingComponent />, container);
    });
  });

  it('render without crashing and with values', () => {
    act(() => {
      ReactDOM.render(
        <TradingComponent
          balancePrice="42,332.40"
          tradingLogo={`<Logo />`}
          tradingTokenSymbol="FTM"
          tradingActualPrice="2,000.0"
          tradingApproxPrice="≈ $3,540.32"
          title="Binance"
          isDisplayBalance={true}
          showSwapIcon={true}
          limitValueName="test"
          limitSubValueName="test"
          isDisplayRefresh={true}
          limitValue="1000"
          onChangeInput={() => {}}
          index={0}
        />,
        container,
      );
    });
  });

  it('render Trading with tradingLogo Background-Image Prop', () => {
    const { getByTestId } = render(
      <TradingComponent tradingLogo={`<Logo />`} />,
    );
    expect(getByTestId('Trading')).toHaveStyle(
      `background-image: url(<Logo />)`,
    );
  });

  it('Matches SnapShot without Values', () => {
    let TradingSnapShot;
    rendererAct(() => {
      TradingSnapShot = create(<TradingComponent />);
    });
    expect(TradingSnapShot.toJSON()).toMatchSnapshot();
  });

  it('Matches SnapShot With Values', () => {
    let TradingSnapShot;
    rendererAct(() => {
      TradingSnapShot = create(
        <TradingComponent
          balancePrice="42,332.40"
          tradingLogo={`<Logo />`}
          tradingTokenSymbol="FTM"
          tradingActualPrice="2,000.0"
          tradingApproxPrice="≈ $3,540.32"
          title="Binance"
          isDisplayBalance={true}
          showSwapIcon={true}
          limitValueName="test"
          limitSubValueName="test"
          isDisplayRefresh={true}
          limitValue="1000"
          onChangeInput={() => {}}
          index={0}
        />,
      );
    });
    expect(TradingSnapShot.toJSON()).toMatchSnapshot();
  });
});
