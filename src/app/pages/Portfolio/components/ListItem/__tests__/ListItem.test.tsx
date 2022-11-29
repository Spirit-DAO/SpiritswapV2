import React from 'react';
import ReactDOM from 'react-dom';
import ListItem from '../ListItem';
import { Props as ListItemProps } from '../ListItem.d';
import { render, cleanup } from '@testing-library/react';
import ThemeProvider from 'theme';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { Token } from 'app/utils';
import { TokenOptions } from 'app/utils/tokenOptions';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';
import { SPIRIT } from 'constants/index';

describe('ListItem-Component', () => {
  let container;
  const ListItemTestId = 'ListItem';
  const { act: rendererAct, create } = renderer;
  const ListItemComponent = ({ ...props }: ListItemProps) => {
    return (
      <ChakraThemeWrapper>
        <ThemeProvider>
          <React.StrictMode>
            <ListItem {...props} data-testid={ListItemTestId} />
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

  it('renders without crashing and without empty values ', () => {
    act(() => {
      ReactDOM.render(
        <ListItemComponent
          tokenName=""
          tokenAmount=""
          usdAmount=""
          options={TokenOptions(SPIRIT.address)}
        />,
        container,
      );
    });
  });

  it('renders without crashing and with Values', () => {
    act(() => {
      ReactDOM.render(
        <ListItemComponent
          tokenName={Token.DAI}
          tokenAmount="4,050.33"
          usdAmount="5,530.20"
          options={TokenOptions(SPIRIT.address)}
        />,
        container,
      );
    });
    act(() => {
      ReactDOM.render(
        <ListItemComponent
          tokenName={Token.DAI}
          tokenAmount="4,050.33"
          usdAmount="5,530.20"
          options={TokenOptions(SPIRIT.address)}
        />,
        container,
      );
    });
  });

  xit('renders ListItem with All Props', () => {
    const tokenName = Token.DAI;
    const tokenAmount = '4,050.33';
    const usdAmount = '5,530.20';
    const options = TokenOptions;
    const { getByTestId } = render(
      <ListItemComponent
        tokenName={tokenName}
        tokenAmount={tokenAmount}
        usdAmount={usdAmount}
        options={options(SPIRIT.address)}
      />,
    );

    expect(getByTestId(ListItemTestId)).toHaveTextContent(tokenName);
    expect(getByTestId(ListItemTestId)).toHaveTextContent(tokenAmount);
    expect(getByTestId(ListItemTestId)).toHaveTextContent(usdAmount);
  });

  it('OnClick', () => {
    const { container } = render(
      <ListItemComponent
        tokenName={Token.DAI}
        tokenAmount="4,050.33"
        usdAmount="5,530.20"
        options={TokenOptions(SPIRIT.address)}
      />,
    );
    const Svg = container.querySelector('svg');
    expect(Svg).toBeTruthy();
  });

  it('Matches SnapShot with Empty Values', () => {
    let ListItemSnapShot;
    rendererAct(() => {
      ListItemSnapShot = create(
        <ListItemComponent
          tokenName=""
          tokenAmount={''}
          usdAmount={''}
          options={TokenOptions(SPIRIT.address)}
        />,
      );
    });

    expect(ListItemSnapShot.toJSON()).toMatchSnapshot();
  });

  it('Matches SnapShot with Values and singal Token', () => {
    let ListItemSnapShot;
    const tokenName = Token.DAI;
    const tokenAmount = '4,050.33';
    const usdAmount = '5,530.20';
    const options = TokenOptions;
    rendererAct(() => {
      ListItemSnapShot = create(
        <ListItemComponent
          tokenName={tokenName}
          tokenAmount={tokenAmount}
          usdAmount={usdAmount}
          options={options(SPIRIT.address)}
        />,
      );
    });

    expect(ListItemSnapShot.toJSON()).toMatchSnapshot();
  });

  it('Matches SnapShot with Values with Double Token', () => {
    let ListItemSnapShot;
    const tokenName = Token.DAI;
    const tokenAMount = '4,050.33';
    const usdAmount = '5,530.20';
    const options = TokenOptions;
    rendererAct(() => {
      ListItemSnapShot = create(
        <ListItemComponent
          tokenName={tokenName}
          tokenAmount={tokenAMount}
          usdAmount={usdAmount}
          options={options(SPIRIT.address)}
        />,
      );
    });

    expect(ListItemSnapShot.toJSON()).toMatchSnapshot();
  });
});
