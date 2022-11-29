import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'store';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { SettingsModal } from 'app/components/SettingsModal';
import { mockUseTranslation } from 'mocks/i18nForTests';
import ThemeProvider from 'theme';
import { ChakraThemeProvider } from 'theme/chakra';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe('<SettingsModal />', () => {
  const props = {};
  const renderComponent = props =>
    render(
      <Provider store={store}>
        <ChakraThemeProvider>
          <ThemeProvider>
            <ThemeWrapper>
              <SettingsModal {...props} />
            </ThemeWrapper>
          </ThemeProvider>
        </ChakraThemeProvider>
      </Provider>,
    );

  it('should render and match snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });

  it('should call onClose', () => {
    const onClose = jest.fn();
    const { getByTestId } = renderComponent({ ...props, onClose });
    fireEvent.click(getByTestId('close-action'));

    expect(onClose).toHaveBeenCalled();
  });
});
