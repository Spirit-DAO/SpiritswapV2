import { render } from '@testing-library/react';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { ChakraThemeProvider } from 'theme/chakra';
import { TokenInfoBar } from 'app/layouts/TopBar/components/TokenInfoBar';

describe('<TokenInfoBar />', () => {
  const props = {};
  const renderComponent = props =>
    render(
      <ThemeWrapper>
        <ChakraThemeProvider>
          <TokenInfoBar {...props} />
        </ChakraThemeProvider>
      </ThemeWrapper>,
    );

  it('should render and match snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });
});
