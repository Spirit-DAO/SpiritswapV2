import { fireEvent, render } from '@testing-library/react';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { Provider } from 'react-redux';
import { store } from 'store';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';
import ModalToken from '../ModalToken';
import { tokens } from 'constants/tokens';
import { QueryClientProvider } from 'react-query';
import { queryClient } from 'config/queryClient';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe(`<ModalToken />`, () => {
  const props = { tokens, isOpen: true };
  const renderComponent = props =>
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ChakraThemeWrapper>
            <ModalToken {...props} />
          </ChakraThemeWrapper>
        </QueryClientProvider>
      </Provider>,
    );

  it('should render and match the snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });
  it('should render even is there is not token list', () => {
    const component = renderComponent({});
    expect(component).toMatchSnapshot();
  });
  it('should type the input and clean after click on the BackSpace', () => {
    const component = renderComponent(props);
    const input = component.queryByLabelText(
      'search-input',
    ) as HTMLInputElement;
    const resetInput = component.queryByLabelText(
      'Delete',
    ) as HTMLButtonElement;

    fireEvent.change(input, { target: { value: 'FTM' } });
    expect(input.value).toBe('FTM');
    fireEvent.click(resetInput);
    expect(input.value).toBe('');
  });
});
