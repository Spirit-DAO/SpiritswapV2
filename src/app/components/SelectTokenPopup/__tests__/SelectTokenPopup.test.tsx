import { render } from '@testing-library/react';
import { SelectTokenPopup } from '../index';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe(`<SelectTokenPopup />`, () => {
  const props = {};
  const renderComponent = props =>
    render(
      <ThemeWrapper>
        <SelectTokenPopup {...props} />
      </ThemeWrapper>,
    );

  it('should render and match the snapshot', () => {
    const component = renderComponent(props);
    expect(component).toMatchSnapshot();
  });
});
