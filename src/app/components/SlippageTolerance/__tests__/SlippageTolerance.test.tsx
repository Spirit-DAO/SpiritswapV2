/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import SlippageTolerance from '../SlippageTolerance';
import { Props as SlippageToleranceProps } from '../SlippageTolerance.d';
import { render, cleanup, fireEvent } from '@testing-library/react';
import ThemeProvider from 'theme';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';

describe('SlippageTolerance-Component', () => {
  let container;
  const SlippageToleranceTestId = 'SlippageTolerance';
  const { act: rendererAct, create } = renderer;
  const SlippageToleranceComponent = ({ ...props }: SlippageToleranceProps) => {
    return (
      <ChakraThemeWrapper>
        <ThemeProvider>
          <React.StrictMode>
            <SlippageTolerance
              {...props}
              data-testid={SlippageToleranceTestId}
            />
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

  it('renders without crashing and without Values', () => {
    act(() => {
      ReactDOM.render(<SlippageToleranceComponent labels={[]} />, container);
    });
  });

  it('renders without crashing and with Values', () => {
    act(() => {
      ReactDOM.render(
        <SlippageToleranceComponent
          labels={['0.1%', '0.5%', '1%', 'Auto']}
          disabled={false}
          customPlaceholder="Custom"
          selected={0}
          customValue=""
          onChange={() => {}}
        />,
        container,
      );
    });
  });

  it('renders SlippageTolerance with Labels Props', () => {
    const Labels = ['0.1%', '0.5%', '1%', 'Auto'];
    const { getByTestId } = render(
      <SlippageToleranceComponent labels={Labels} />,
    );
    Labels.map(value => {
      expect(getByTestId(SlippageToleranceTestId)).toHaveTextContent(value);
    });
  });

  it('renders SlippageTolerance with customPlaceholder Prop', () => {
    const CustomPlaceHolder = 'Custom';
    const { container } = render(
      <SlippageToleranceComponent
        labels={[]}
        customPlaceholder={CustomPlaceHolder}
      />,
    );
    const input = container.querySelector('input');

    expect(input).toBeTruthy();
    if (input) {
      expect(input.placeholder).toBe(CustomPlaceHolder);
    }
  });

  it('renders SlippageTolerance with customValue Prop', () => {
    const CustomValue = 'SlippageTolerance';
    const { container } = render(
      <SlippageToleranceComponent labels={[]} customValue={CustomValue} />,
    );
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
    if (input) {
      expect(input.value).toBe(CustomValue);
    }
  });

  it('onClick customValue Prop', () => {
    const handleClick = jest.fn();
    let TestValues = 'testValue';
    const PropsValues = {
      labels: ['0.1%', '0.5%', '1%', 'Auto'],
      selected: 0,
      customValue: 'test',
      onChange: handleClick,
    };
    const { container, getByTestId } = render(
      <SlippageToleranceComponent {...PropsValues} />,
    );
    const input = container.querySelector('input');

    expect(input).toBeTruthy();
    if (input) {
      fireEvent.click(input);
      expect(handleClick).toHaveBeenCalled();
    }
    if (input) {
      const elementbyId = getByTestId(SlippageToleranceTestId);
      expect(elementbyId.onchange).toBe(null);
      const elementInput = elementbyId.querySelector(
        'input',
      ) as HTMLInputElement;
      fireEvent.click(elementInput, {
        target: {
          value: TestValues,
        },
      });
      expect(elementInput?.value).toBe(TestValues);
    }
  });

  it('onCLick labels Prop', () => {
    const handleClick = jest.fn();
    const PropsValues = {
      labels: ['0.1%', '0.5%', '1%', 'Auto'],
      selected: undefined,
      customValue: 'test',
      onChange: handleClick,
    };
    const { getByText } = render(
      <SlippageToleranceComponent {...PropsValues} />,
    );
    const elements: any = PropsValues.labels.map(value => {
      return getByText(value);
    });
    elements.map(element => {
      expect(element).toBeTruthy();
    });

    if (elements) {
      elements.map(element => {
        fireEvent.click(element);
        expect(handleClick).toHaveBeenCalled();
      });
    }
  });

  it('onChange and Click selected Prop', () => {
    let selected = 0;
    let selectedValue = '';
    let onChangeValue = 'nothing';
    const PropsValues = {
      labels: ['0.1%', '0.5%', '1%', 'Auto'],
      selected: selected,
      customValue: 'Undefined',
      onChange: e => {
        onChangeValue = e?.value;
        selected = e?.index;
        selectedValue = e?.value;
      },
    };
    const { container, getByText, getByTestId } = render(
      <SlippageToleranceComponent {...PropsValues} />,
    );
    const input = container.querySelector('input');
    const elements: any = PropsValues.labels.map(value => {
      return getByText(value);
    });
    elements.map(element => {
      expect(element).toBeTruthy();
    });
    expect(input).toBeTruthy();
    const elementbyId = getByTestId(SlippageToleranceTestId);
    if (input) {
      expect(elementbyId.onchange).toBe(null);
      const elementInput = elementbyId.querySelector(
        'input',
      ) as HTMLInputElement;
      fireEvent.change(elementInput, {
        target: {
          value: 'TestVallue',
        },
      });
      expect(elementInput?.value).toBe('Undefined');
      expect(onChangeValue).toBe('TestVallue');
    }
    if (elements) {
      elements.map((element: HTMLElement, index) => {
        fireEvent.click(element, index);
        expect(selected).toBe(index);
        expect(element.textContent).toBe(selectedValue);
      });
    }
  });

  it('Matches SnapShot without Values', () => {
    let SlippageToleranceSnapShot;
    rendererAct(() => {
      SlippageToleranceSnapShot = create(
        <SlippageToleranceComponent labels={[]} />,
      );
    });

    expect(SlippageToleranceSnapShot.toJSON()).toMatchSnapshot();
  });

  it('Matches SnapShot With values,disabled = true Prop', () => {
    let SlippageToleranceSnapShot;

    rendererAct(() => {
      SlippageToleranceSnapShot = create(
        <SlippageToleranceComponent
          labels={['0.1%', '0.5%', '1%', 'Auto']}
          disabled={true}
          customPlaceholder="Custom"
          selected={0}
          customValue=""
        />,
      );
    });

    expect(SlippageToleranceSnapShot.toJSON()).toMatchSnapshot();
  });

  it('Matches SnapShot With Values, disabled = false Prop', () => {
    let SlippageToleranceSnapShot;

    rendererAct(() => {
      SlippageToleranceSnapShot = create(
        <SlippageToleranceComponent
          labels={['0.1%', '0.5%', '1%', 'Auto']}
          disabled={false}
          customPlaceholder="Custom"
          selected={0}
          customValue=""
        />,
      );
    });

    expect(SlippageToleranceSnapShot.toJSON()).toMatchSnapshot();
  });
});
