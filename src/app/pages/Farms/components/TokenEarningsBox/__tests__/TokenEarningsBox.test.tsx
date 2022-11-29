import React from 'react';
import ReactDOM from 'react-dom';
import TokenEarningsBox from '../TokenEarningsBox';
import { Props as TokenEarningsBoxProps } from '../TokenEarningsBox.d';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'store';
import ThemeProvider from 'theme';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { darkTheme } from 'theme/dark/index';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';

describe('TokenEarningsBox-Component', () => {
  let container;
  const { act: rendererAct, create } = renderer;
  const TokenEarningsBoxTestId = 'TokenEarningsBox';

  const TokenEarningsBoxComponent = ({ ...props }: TokenEarningsBoxProps) => {
    return (
      <ChakraThemeWrapper>
        <ThemeProvider>
          <Provider store={store}>
            <React.StrictMode>
              <TokenEarningsBox {...props} />
            </React.StrictMode>
          </Provider>
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

  it('renders without crashing and without values', () => {
    act(() => {
      ReactDOM.render(<TokenEarningsBoxComponent />, container);
    });
  });

  it('renders without crashing and with values', () => {
    act(() => {
      ReactDOM.render(
        <TokenEarningsBoxComponent
          label="Your APR"
          value={`3.454`}
          subLabel="0.95"
          highlight={true}
        />,
        container,
      );
    });
  });

  it('render TokenEarningsBox With lable Prop', () => {
    const TestValue = 'Your APR';
    const { getByTestId } = render(
      <TokenEarningsBoxComponent label={TestValue} />,
    );
    expect(getByTestId(TokenEarningsBoxTestId)).toHaveTextContent(TestValue);
  });

  it('render TokenEarningsBox with SubLable Prop', () => {
    const TestValue = '0.95';
    const { getByTestId } = render(
      <TokenEarningsBoxComponent subLabel={TestValue} />,
    );
    expect(getByTestId(TokenEarningsBoxTestId)).toHaveTextContent(TestValue);
  });

  it('render TokenEarningsBox with Value Prop', () => {
    const TestValue = '3,545';
    const { getByTestId, getByText } = render(
      <TokenEarningsBoxComponent value={TestValue} />,
    );
    expect(getByTestId(TokenEarningsBoxTestId)).toHaveTextContent(TestValue);
    expect(getByText(TestValue)).not.toHaveStyle(`color:${darkTheme.color.ci}`);
  });

  it('render TokenEarningsBox with Value & highlight', () => {
    const TestValue = '2,345';
    const { getByText } = render(
      <TokenEarningsBoxComponent value={TestValue} highlight={true} />,
    );
    expect(getByText(TestValue)).toHaveStyle(`color:${darkTheme.color.ci}`);
  });

  it('Matches SnapShot without Values', () => {
    let TokenEarningsBoxSnapShot;
    rendererAct(() => {
      TokenEarningsBoxSnapShot = create(<TokenEarningsBoxComponent />);
    });
    expect(TokenEarningsBoxSnapShot.toJSON()).toMatchSnapshot();
  });

  it('Matches SnapShot with Values', () => {
    let TokenEarningsBoxSnapShot;
    rendererAct(() => {
      TokenEarningsBoxSnapShot = create(
        <TokenEarningsBoxComponent
          label="Your APR"
          value={`3.454`}
          subLabel="0.95"
          highlight={true}
        />,
      );
    });
    expect(TokenEarningsBoxSnapShot.toJSON()).toMatchSnapshot();
  });
});
