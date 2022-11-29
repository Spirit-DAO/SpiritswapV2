import { render } from '@testing-library/react';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';
import NewTokenAmountPanel from '../NewTokenAmountPanel';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe(`<NewTokenAmountPanel />`, () => {
  const props = {};
  const renderComponent = props =>
    render(
      <ChakraThemeWrapper>
        <NewTokenAmountPanel {...props} />
      </ChakraThemeWrapper>,
    );

  xit('should render and match the snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });
});
