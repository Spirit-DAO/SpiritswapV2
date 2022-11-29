import { render } from '@testing-library/react';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';
import { SelectList } from '..';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe(`<SelectList />`, () => {
  const props = {};
  const renderComponent = props =>
    render(
      <ChakraThemeWrapper>
        <SelectList {...props} />
      </ChakraThemeWrapper>,
    );

  it('should render and match the snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });
});
