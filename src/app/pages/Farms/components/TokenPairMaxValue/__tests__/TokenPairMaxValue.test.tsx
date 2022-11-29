import React from 'react';
import ReactDOM from 'react-dom';
import TokenPairMaxValue from '../TokenPairMaxValue';
import { Props as TokenPairMaxValueProps } from '../TokenPairMaxValue.d';
import { render, cleanup, fireEvent } from '@testing-library/react';
import ThemeProvider from 'theme';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { i18n } from 'locales/i18n';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';

describe('TokenPairMaxValue-Component', () => {
  const { act: rendererAct, create } = renderer;
  let container;
  const TokenPairMaxValueTestId = 'TokenPairMaxValue';
  const translationPath = 'common.tokenPairMaxValue';
  const TokenPairMaxValueComponent = ({ ...props }: TokenPairMaxValueProps) => {
    return (
      <ChakraThemeWrapper>
        <ThemeProvider>
          <React.StrictMode>
            <TokenPairMaxValue {...props} />
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

  it('renders without crashing and without Values', () => {
    act(() => {
      ReactDOM.render(
        <TokenPairMaxValueComponent
          onMaxClick={() => {}}
          value=""
          onchange={() => {}}
          amountStaked=""
          tokens={[]}
        />,
        container,
      );
    });
  });

  it('renders without crashing and with Values', () => {
    act(() => {
      ReactDOM.render(
        <TokenPairMaxValueComponent
          value="2,000.0"
          moneyValue="≈ $3,540.32"
          tokens={['BTC', 'ETH']}
          amountValue="262.34"
          amountType="balance"
          onchange={() => {}}
          amountStaked=""
          onMaxClick={() => {}}
        />,
        container,
      );
    });
  });

  it('render TokenPairMaxValue with tokens Props and Translated Values', async () => {
    const t = await i18n;
    const Tokens = ['BTC', 'ETH'];
    let TokenPairMaxValueSnapShot;
    const transalteValue = t(`${translationPath}.max`);
    const { getByTestId } = render(
      <TokenPairMaxValueComponent
        tokens={Tokens}
        onMaxClick={() => {}}
        onchange={() => {}}
        amountStaked=""
        value=""
      />,
    );

    expect(getByTestId(TokenPairMaxValueTestId)).toHaveTextContent(
      transalteValue,
    );
    Tokens.map(value => {
      expect(getByTestId(TokenPairMaxValueTestId)).toHaveTextContent(value);
      return null;
    });

    rendererAct(() => {
      TokenPairMaxValueSnapShot = create(
        <TokenPairMaxValueComponent
          tokens={Tokens}
          onMaxClick={() => {}}
          onchange={() => {}}
          amountStaked=""
          value=""
        />,
      );
    });
    expect(TokenPairMaxValueSnapShot.toJSON()).toMatchSnapshot();
  });

  it('render TokenPairMaxValue with amountValue and amountType Prop with Translated Values', async () => {
    const t = await i18n;
    const AmountType = 'balance';
    const AmountValue = '262.34';
    const translatedValues = t(`${translationPath}.${AmountType}`);

    const { getByTestId } = render(
      <TokenPairMaxValueComponent
        tokens={['BTC', 'ETH']}
        amountValue={AmountValue}
        amountType={AmountType}
        onMaxClick={() => {}}
        onchange={() => {}}
        amountStaked=""
        value=""
      />,
    );
    expect(getByTestId(TokenPairMaxValueTestId)).toHaveTextContent(
      translatedValues,
    );
    expect(getByTestId(TokenPairMaxValueTestId)).toHaveTextContent(AmountValue);
  });

  it('TokenPairMaxValue onMaxClick props', () => {
    const testInputTest = 'TestInput';
    const { container } = render(
      <TokenPairMaxValueComponent
        tokens={['BTC', 'ETH']}
        onMaxClick={() => {}}
        onchange={() => {}}
        amountStaked=""
        value=""
      />,
    );
    const input = container.querySelector('button');
    expect(input).toBeTruthy();
    if (input) {
      fireEvent.click(input, { target: { value: testInputTest } });
      expect(input.value).toBe(testInputTest);
    }
  });

  it('Matches Snapshot without Values', () => {
    let TokenPairMaxValueSnapShot;
    rendererAct(() => {
      TokenPairMaxValueSnapShot = create(
        <TokenPairMaxValueComponent
          onMaxClick={() => {}}
          value=""
          tokens={[]}
          onchange={() => {}}
          amountStaked=""
        />,
      );
    });
    expect(TokenPairMaxValueSnapShot.toJSON()).toMatchSnapshot();
  });

  it('Matches SnapShot with Values', () => {
    let TokenPairMaxValueSnapShot;
    rendererAct(() => {
      TokenPairMaxValueSnapShot = create(
        <TokenPairMaxValueComponent
          value="2,000.0"
          moneyValue="≈ $3,540.32"
          tokens={['BTC', 'ETH']}
          amountValue="262.34"
          amountType="balance"
          onchange={() => {}}
          amountStaked=""
          onMaxClick={() => {}}
        />,
      );
    });
    expect(TokenPairMaxValueSnapShot.toJSON()).toMatchSnapshot();
  });
});
