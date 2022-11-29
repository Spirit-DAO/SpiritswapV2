import React from 'react';
import ReactDOM from 'react-dom';
import ProgressBar from '../ProgressBar';
import { Props as ProgressBarProps } from '../ProgressBar.d';
import { cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'store';
import ThemeProvider from 'theme';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';

describe('ProgressBar-Componenet', () => {
  let container;
  const { act: rendererAct, create } = renderer;

  const ProgressBarComponent = ({ ...props }: ProgressBarProps) => {
    return (
      <ThemeProvider>
        <Provider store={store}>
          <React.StrictMode>
            <ProgressBar {...props} />
          </React.StrictMode>
        </Provider>
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

  it('renders without crashing and Empty Value Prop', () => {
    act(() => {
      ReactDOM.render(<ProgressBarComponent value={0} />, container);
    });
  });

  it('renders without crashing and  Default Value Prop', () => {
    act(() => {
      ReactDOM.render(<ProgressBarComponent value={40} />, container);
    });
  });

  it('renders without crashing and Full Value Prop', () => {
    act(() => {
      ReactDOM.render(<ProgressBarComponent value={100} />, container);
    });
  });

  it('Matches SnapShot with Empty Value Prop', () => {
    let ProgressBarSnapShot;
    rendererAct(() => {
      ProgressBarSnapShot = create(<ProgressBarComponent value={0} />);
    });
    expect(ProgressBarSnapShot.toJSON()).toMatchSnapshot();
  });

  it('Matches SnapShot with Default Value Prop', () => {
    let ProgressBarSnapShot;
    rendererAct(() => {
      ProgressBarSnapShot = create(<ProgressBarComponent value={40} />);
    });
    expect(ProgressBarSnapShot.toJSON()).toMatchSnapshot();
  });

  it('Matches SnapShot with Full Value Prop', () => {
    let ProgressBarSnapShot;
    rendererAct(() => {
      ProgressBarSnapShot = create(<ProgressBarComponent value={100} />);
    });
    expect(ProgressBarSnapShot.toJSON()).toMatchSnapshot();
  });
});
