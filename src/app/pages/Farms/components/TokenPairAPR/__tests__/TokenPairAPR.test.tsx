import React from 'react';
import ReactDOM from 'react-dom';
import TokenPairAPR from '../TokenPairAPR';
import { Props as TokenPairAPRProps } from '../TokenPairAPR.d';
import { render, cleanup } from '@testing-library/react';
import ThemeProvider from 'theme';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';

describe('TokenPairAPR-Component', () => {
  let container;
  const { act: rendererAct, create } = renderer;

  const TokenPairAPRTestId = 'TokenPairAPR';
  const TokenPairAPRComponent = ({ ...props }: TokenPairAPRProps) => {
    return (
      <ChakraThemeWrapper>
        <ThemeProvider>
          <React.StrictMode>
            <TokenPairAPR {...props} />
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

  it('renders without crashing and without values ', () => {
    act(() => {
      ReactDOM.render(
        <TokenPairAPRComponent tokens={['']} label="" apr={''} />,
        container,
      );
    });
  });

  it('renders without crashing and with Values', () => {
    act(() => {
      ReactDOM.render(
        <TokenPairAPRComponent
          tokens={['BTC', 'ETH']}
          label="APR"
          apr={45.45}
        />,
        container,
      );
    });
  });

  it('TokenPairAPR tokens Icons', () => {
    const { container } = render(
      <TokenPairAPRComponent tokens={['BTC', 'ETH']} label="" apr={''} />,
    );
    const TokenIcon = container.getElementsByTagName('svg');
    expect(TokenIcon).toBeDefined();
  });

  it('TokenPairAPR with Props', () => {
    const TestValuetokens = ['BTC', 'ETH'];
    const TestValuelabel = 'APR';
    const TestValueapr = 45.45;

    const { getByTestId } = render(
      <TokenPairAPRComponent
        tokens={TestValuetokens}
        label={TestValuelabel}
        apr={TestValueapr}
      />,
    );
    expect(getByTestId(TokenPairAPRTestId)).toHaveTextContent(TestValuelabel);
    expect(getByTestId(TokenPairAPRTestId)).toHaveTextContent(
      TestValueapr.toString(),
    );
    TestValuetokens.map(value => {
      expect(getByTestId(TokenPairAPRTestId)).toHaveTextContent(value);
      return null;
    });
  });

  it('Matches SnapShot without Values', () => {
    let TokenPairAPRSnapShot;
    rendererAct(() => {
      TokenPairAPRSnapShot = create(
        <TokenPairAPRComponent tokens={['']} label="" apr={''} />,
      );
    });
    expect(TokenPairAPRSnapShot.toJSON()).toMatchSnapshot();
  });

  it('Matches SnapShot with Values', () => {
    let TokenPairAPRSnapShot;
    rendererAct(() => {
      TokenPairAPRSnapShot = create(
        <TokenPairAPRComponent
          tokens={['BTC', 'ETH']}
          label="APR"
          apr={45.45}
        />,
      );
    });

    expect(TokenPairAPRSnapShot.toJSON()).toMatchSnapshot();
  });
});
