import React from 'react';
import ReactDOM from 'react-dom';
import TotalTrading from '../TotalTrading';
import { Props as TotalTradingProps } from '../TotalTrading.d';
import { render, cleanup } from '@testing-library/react';
import ThemeProvider from '../../../../../../theme';
import renderer from 'react-test-renderer';
import { i18n } from '../../../../../../locales/i18n';
import { act } from 'react-dom/test-utils';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';

describe('TotalTrading-Component', () => {
  let container;
  const { act: rendererAct, create } = renderer;
  const translationPath = 'home.about.swap.trading.totalTrading';
  const TotalTradingComponent = ({ ...props }: TotalTradingProps) => {
    return (
      <ChakraThemeWrapper>
        <ThemeProvider>
          <React.StrictMode>
            <TotalTrading {...props} />
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

  it('renders without crashing and with values', () => {
    act(() => {
      ReactDOM.render(
        <TotalTradingComponent
          liquidityTradeEstimate="9,850.341 FTM/SPIRIT LP"
          liquidityTradeEstimateUSD="≈ $7,072.43"
        />,
        container,
      );
    });
  });

  it('render TotalTrading Correctly ', async () => {
    const t = await i18n;
    const TranslatedText = t(`${translationPath}.YouWillReceive`);

    const { getByTestId } = render(
      <TotalTradingComponent
        liquidityTradeEstimate="9,850.341 FTM/SPIRIT LP"
        liquidityTradeEstimateUSD="≈ $7,072.43"
      />,
    );
    expect(t).toBeDefined();
    expect(getByTestId('TotalTrading')).toHaveTextContent(
      '9,850.341 FTM/SPIRIT LP',
    );
    expect(getByTestId('TotalTrading')).toHaveTextContent('≈ $7,072.43');

    expect(getByTestId('TotalTrading')).toHaveTextContent(TranslatedText);
  });

  it('Matches SnapShot with Values', async () => {
    let TotalTradingSnapShotWithValues;
    rendererAct(() => {
      TotalTradingSnapShotWithValues = create(
        <TotalTradingComponent
          liquidityTradeEstimate="9,850.341 FTM/SPIRIT LP"
          liquidityTradeEstimateUSD="≈ $7,072.43"
        />,
      );
    });
    expect(TotalTradingSnapShotWithValues.toJSON()).toMatchSnapshot();
  });
});
