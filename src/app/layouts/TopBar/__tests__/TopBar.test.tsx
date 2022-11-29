import { render } from '@testing-library/react';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { TopBar } from 'app/layouts/TopBar';
import { MemoryRouter } from 'react-router-dom';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { Provider } from 'react-redux';
import { store } from 'store';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe('<TopBar />', () => {
  const props = {};
  const renderComponent = props =>
    render(
      <MemoryRouter>
        <Provider store={store}>
          <ChakraThemeWrapper>
            <ThemeWrapper>
              <TopBar {...props} />
            </ThemeWrapper>
          </ChakraThemeWrapper>
        </Provider>
      </MemoryRouter>,
    );

  it('should render and match snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });
});
