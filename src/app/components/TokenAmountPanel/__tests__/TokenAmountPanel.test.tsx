import React from 'react';
import ReactDOM from 'react-dom';
import TokenAmountPanel from '../TokenAmountPanel';
import { Props as TokenAmountPanelProps } from '../TokenAmountPanel.d';
import { render, cleanup, fireEvent } from '@testing-library/react';
import ThemeProvider from 'theme';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { i18n } from '../../../../locales/i18n';
import {
  Currency,
  TokenCurrencyConversionRateMap,
  Token,
  Wallet,
} from 'app/utils';

describe('TokenAmountPanel-Componenet', () => {
  let container;
  const { act: rendererAct, create } = renderer;

  const TokenAmountPanelTestId = 'TokenAmountPanel';
  const translationPath = 'common.tokenAmountPanel';

  const TokenAmountPanelComponent = ({ ...props }: TokenAmountPanelProps) => {
    return (
      <ThemeProvider>
        <React.StrictMode>
          <TokenAmountPanel {...props} />
        </React.StrictMode>
      </ThemeProvider>
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

  it('Should initiate i18n', async () => {
    const t = await i18n;
    expect(t).toBeDefined();
  });

  it('renders without crashing and with values', () => {
    act(() => {
      ReactDOM.render(
        <TokenAmountPanelComponent
          tokenConversionRates={
            {
              PAC: {
                conversionRate: 4.746487134128409 as number,
                currency: 'USD' as Currency.USD,
                token: 'PAC' as Token,
              },
            } as TokenCurrencyConversionRateMap
          }
          currency={'USD' as Currency.USD}
          limitSwap="sell"
          value={{ token: 'PAC' as Token, value: 1234 as number }}
          onChange={() => {}}
          defaultSelectedToken={'PAC' as Token}
          wallet={{ portfolio: { PAC: 123123 as number } } as Wallet}
        />,
        container,
      );
    });
  });

  xit('render TokenAmountPanel with Translated Text Values', async () => {
    const t = await i18n;
    const { getByTestId } = render(
      <TokenAmountPanelComponent currency={'USD' as Currency.USD} />,
    );

    expect(t).toBeDefined();
    const TranslatedTextMax = t(`${translationPath}.max`);
    const TranslatedTextnotConnected = t(`${translationPath}.notConnected`);

    expect(getByTestId(TokenAmountPanelTestId)).toHaveTextContent(
      TranslatedTextMax,
    );
    expect(getByTestId(TokenAmountPanelTestId)).toHaveTextContent(
      TranslatedTextnotConnected,
    );
  });

  it('render TokenAmountpanel with wallet Prop Conditional Translated Values', async () => {
    const t = await i18n;
    const TranslatedTextBalance = t(`${translationPath}.balance`);
    const { getByTestId } = render(
      <TokenAmountPanelComponent
        wallet={{ portfolio: { PAC: 123123 as number } } as Wallet}
        currency={'USD' as Currency.USD}
      />,
    );
    expect(getByTestId(TokenAmountPanelTestId)).toHaveTextContent(
      TranslatedTextBalance,
    );
  });

  it('render TokenAmountPanel with LimitSwap Prop conditional translated values', async () => {
    const t = await i18n;
    const limitSwapValue = 'buy';
    const TranslatedText = t(`${translationPath}.setLimit.${limitSwapValue}`);
    const TranslateText2nd = t(
      `${translationPath}.market.${
        limitSwapValue === 'buy' ? 'above' : 'below'
      }`,
    );
    const TranslateText3rd = t(`${translationPath}.market.below`);

    const { getByTestId } = render(
      <TokenAmountPanelComponent
        limitSwap={limitSwapValue}
        currency={'USD' as Currency.USD}
      />,
    );
    expect(getByTestId(TokenAmountPanelTestId)).toHaveTextContent(
      TranslatedText,
    );
    expect(getByTestId(TokenAmountPanelTestId)).toHaveTextContent(
      TranslateText2nd,
    );
    expect(getByTestId(TokenAmountPanelTestId)).not.toHaveTextContent(
      TranslateText3rd,
    );
  });

  it('render TokenAmountPanel with limitSwap Prop', () => {
    const TestValue = 'sell';
    const { getByTestId } = render(
      <TokenAmountPanelComponent
        limitSwap={TestValue}
        currency={'USD' as Currency.USD}
      />,
    );
    expect(getByTestId(TokenAmountPanelTestId)).toHaveTextContent(TestValue);
  });

  it('render TokenAmountPanel with defaultSelectedToken Prop', () => {
    const TestValue = 'PAC' as Token;
    const { getByTestId } = render(
      <TokenAmountPanelComponent
        defaultSelectedToken={TestValue}
        currency={'USD' as Currency.USD}
      />,
    );
    expect(getByTestId(TokenAmountPanelTestId)).toHaveTextContent(TestValue);
  });

  it('onClickInput limitSwap prop', () => {
    const testInputText = 'testInputText';
    const { container } = render(
      <TokenAmountPanelComponent
        limitSwap="sell"
        currency={'USD' as Currency.USD}
      />,
    );
    const input = container.querySelector('input');
    expect(input).toBeTruthy();

    if (input) {
      fireEvent.click(input, { target: { value: testInputText } });
      expect(input.value).toBe(testInputText);
    }
  });

  xit('OnChange Input value Prop ', () => {
    const TextValue = { token: 'PAC' as Token, value: 1234 as number };
    const { container } = render(
      <TokenAmountPanelComponent
        value={TextValue}
        currency={'USD' as Currency.USD}
      />,
    );
    const input = container.querySelector('input');
    expect(input).toBeTruthy();

    if (input) {
      expect(input.value).toBe('1,234');
    }

    if (input) {
      fireEvent.change(input, { target: { value: TextValue.value } });
      expect(input.value).toBe('1,234');
    }
  });

  xit('OnClick ', () => {
    const { container } = render(
      <TokenAmountPanelComponent currency={'USD' as Currency.USD} />,
    );
    const input = container.querySelector('button');
    expect(input).toBeTruthy();

    if (input) {
      fireEvent.click(input, { target: { value: '1,234' } });
      expect(input.value).toBe('1,234');
    }
  });

  xit('OnClick Max ', async () => {
    const t = await i18n;
    const Max = t(`${translationPath}.max`);
    const handleClick = jest.fn();
    const { getByText } = render(
      <TokenAmountPanelComponent
        onChange={handleClick}
        currency={'USD' as Currency.USD}
      />,
    );
    const Button = getByText(Max);
    expect(Button).toBeTruthy();

    if (Button) {
      fireEvent.click(Button);
      expect(handleClick).toHaveBeenCalled();
    }
  });

  xit('OnClick and  OnClickOutSide DropDown', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <TokenAmountPanelComponent
        currency={'USD' as Currency.USD}
        defaultSelectedToken={'PAC' as Token}
        onChange={handleClick}
      />,
    );
    const Element = getByText('PAC');
    expect(Element).toBeTruthy();
    fireEvent.click(Element);

    const DropElement = getByText(Token.BTC0x);
    expect(DropElement).toBeTruthy();

    fireEvent.click(DropElement);
    expect(handleClick).toHaveBeenCalled();
  });

  it('OnFocus ', () => {
    const { container } = render(
      <TokenAmountPanelComponent currency={'USD' as Currency.USD} />,
    );
    const input = container.querySelector('input');
    expect(input).toBeTruthy();

    if (input) {
      fireEvent.focus(input, { target: { value: '1,234' } });
      expect(input.value).toBe('1,234');
    }
  });

  it('onBlur ', () => {
    const { container } = render(
      <TokenAmountPanelComponent currency={'USD' as Currency.USD} />,
    );
    const input = container.querySelector('input');
    expect(input).toBeTruthy();

    if (input) {
      fireEvent.blur(input, { target: { value: '1,234' } });
      expect(input.value).toBe('1,234');
    }
  });

  it('Matches SnapShot without Values', () => {
    let TokenAmountPanelSnapShot;
    rendererAct(() => {
      TokenAmountPanelSnapShot = create(
        <TokenAmountPanelComponent currency={'USD' as Currency.USD} />,
      );
    });

    expect(TokenAmountPanelSnapShot.toJSON()).toMatchSnapshot();
  });

  it('Matches SnapShot with Values', () => {
    let TokenAmountPanelSnapShot;
    rendererAct(() => {
      TokenAmountPanelSnapShot = create(
        <TokenAmountPanelComponent
          tokenConversionRates={
            {
              PAC: {
                conversionRate: 4.746487134128409 as number,
                currency: 'USD' as Currency.USD,
                token: 'PAC' as Token,
              },
            } as TokenCurrencyConversionRateMap
          }
          currency={'USD' as Currency.USD}
          limitSwap="sell"
          value={{ token: 'PAC' as Token, value: 1234 as number }}
          onChange={() => {}}
          defaultSelectedToken={'PAC' as Token}
          wallet={{ portfolio: { PAC: 123123 as number } } as Wallet}
        />,
      );
    });
    expect(TokenAmountPanelSnapShot.toJSON()).toMatchSnapshot();
  });
});
