import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { Footer } from 'app/layouts/Footer';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { store } from 'store';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe('<Footer />', () => {
  const props = {};
  const renderComponent = props => {
    return render(
      <MemoryRouter>
        <ThemeWrapper>
          <Provider store={store}>
            <Footer {...props} />
          </Provider>
        </ThemeWrapper>
      </MemoryRouter>,
    );
  };

  it('should render and match snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });
});
