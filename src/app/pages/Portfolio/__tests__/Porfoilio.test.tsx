import { render } from '@testing-library/react';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { PortfolioPage as Portfolio } from 'app/pages/Portfolio';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from 'store';

describe('<Porfolio />', () => {
  const props = {};
  const renderComponent = props =>
    render(
      <ThemeWrapper>
        <HelmetProvider>
          <Provider store={store}>
            <Portfolio {...props} />
          </Provider>
        </HelmetProvider>
      </ThemeWrapper>,
    );

  it('should render and match snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });
});
