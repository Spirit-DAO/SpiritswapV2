import React from 'react';
import ReactDOM from 'react-dom';
import Slippage from '../Slippage';
import { Props as SlippageProps } from '../Slippage.d';
import { render, cleanup } from '@testing-library/react';
import ThemeProvider from 'theme';
import renderer from 'react-test-renderer';
import { ReactComponent as QuestionIcon } from 'app/assets/images/question-3-circle.svg';
import { act } from 'react-dom/test-utils';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';

describe('Slippage-Component', () => {
  let container;
  const { act: rendererAct, create } = renderer;
  const SlippageTestId = 'Slippage';
  const SlippageComponent = ({ ...props }: SlippageProps) => {
    return (
      <ChakraThemeWrapper>
        <ThemeProvider>
          <React.StrictMode>
            <Slippage {...props} />
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

  it('renders without crashing and without values', () => {
    act(() => {
      ReactDOM.render(
        <SlippageComponent slippageName="" slippageValue="" />,
        container,
      );
    });
  });

  it('renders without crashing and with Values', () => {
    act(() => {
      ReactDOM.render(
        <SlippageComponent
          slippageName="Max Bridge Amount"
          slippageNameIcon={<QuestionIcon />}
          slippageValue="10,000,000 FTM"
          slippageValueIcon={<QuestionIcon />}
        />,
        container,
      );
    });
  });

  it('render Slippage should not render content if not are value ', () => {
    const TestValue = 'Max Bridge Amount';
    const { getByTestId } = render(
      <SlippageComponent slippageName={TestValue} slippageValue="" />,
    );
    expect(getByTestId(SlippageTestId)).toHaveTextContent('');
  });

  it('render Slippage with SlippageValue Prop ', () => {
    const TestValue = '10,000,000 FTM';
    const { getByTestId } = render(
      <SlippageComponent slippageValue={TestValue} slippageName="" />,
    );
    expect(getByTestId(SlippageTestId)).toHaveTextContent(TestValue);
  });

  it('render Slippage with SlippageNameIcon Prop ', () => {
    const { container } = render(
      <SlippageComponent
        slippageNameIcon={<QuestionIcon />}
        slippageName=""
        slippageValue=""
      />,
    );
    const SlippageNameIcon = container.getElementsByTagName('svg');
    expect(SlippageNameIcon).toBeDefined();
  });

  it('render Slippage with SlippageValueIcon Prop', () => {
    const { container } = render(
      <SlippageComponent
        slippageValueIcon={<QuestionIcon />}
        slippageName=""
        slippageValue=""
      />,
    );
    const SlippageValueIcon = container.getElementsByTagName('svg');
    expect(SlippageValueIcon).toBeDefined();
  });

  it('Matches SnapShot without Values', () => {
    let SlippageSnapShot;
    rendererAct(() => {
      SlippageSnapShot = create(
        <SlippageComponent slippageName="" slippageValue="" />,
      );
    });

    expect(SlippageSnapShot.toJSON()).toMatchSnapshot();
  });

  it('Matches SnapShot with Values', () => {
    let SlippageSnapShot;
    rendererAct(() => {
      SlippageSnapShot = create(
        <SlippageComponent
          slippageName="Max Bridge Amount"
          slippageNameIcon={<QuestionIcon />}
          slippageValue="10,000,000 FTM"
          slippageValueIcon={<QuestionIcon />}
        />,
      );
    });

    expect(SlippageSnapShot.toJSON()).toMatchSnapshot();
  });
});
