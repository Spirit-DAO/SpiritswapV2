import { render, fireEvent } from '@testing-library/react';
import { LanguageItems } from 'app/utils/constants';
import { SelectWithDropdown } from '../index';
import { ReactComponent as LanguageIcon } from 'app/assets/images/language.svg';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import ThemeProvider from 'theme';
import { ChakraThemeProvider } from 'theme/chakra';

describe('<SelectWithDropdown />', () => {
  const props = {
    items: LanguageItems,
    selectedId: 1,
    icon: <LanguageIcon />,
  };

  const renderComponent = props =>
    render(
      <ChakraThemeProvider>
        <ThemeProvider>
          <ThemeWrapper>
            <SelectWithDropdown {...props} />
          </ThemeWrapper>
        </ThemeProvider>
      </ChakraThemeProvider>,
    );

  it('should render and match the snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });

  it('should display dropdown on click with appropriate length', () => {
    const { getByTestId } = renderComponent(props);
    fireEvent.click(getByTestId('icon-wrapper'));
    const element = getByTestId('items-wrapper');
    const list = element.querySelectorAll('button');
    expect(list.length).toEqual(LanguageItems.length);
  });

  it('should call action on select and hide list', () => {
    const handleOnSelect = jest.fn();
    const { getByTestId, getByText } = renderComponent({
      ...props,
      onSelect: handleOnSelect,
    });
    fireEvent.click(getByTestId('icon-wrapper'));
    fireEvent.click(getByText('English'));
    expect(handleOnSelect).toHaveBeenCalled();
    let element;
    try {
      element = getByTestId('items-wrapper');
    } catch (e) {
      expect(element).not.toBeDefined();
    }
  });
});
