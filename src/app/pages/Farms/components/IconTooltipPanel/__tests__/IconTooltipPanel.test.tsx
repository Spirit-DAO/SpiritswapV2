import { render } from '@testing-library/react';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { IconTooltipPanel } from 'app/pages/Farms/components/IconTooltipPanel';
import { StyledQuestionIcon } from 'app/pages/Farms/components/IconTooltipPanel/styles';
import { mockUseTranslation } from 'mocks/i18nForTests';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));
describe('<IconTooltipPanel />', () => {
  const props = {
    items: [
      {
        label: 'Total liquidity',
        value: '$29,459.39',
      },
      {
        label: 'APR Range',
        value: '40.66% - 101.56%',
        tooltip: 'Lorem ipsum',
        icon: <StyledQuestionIcon />,
      },
    ],
  };
  const renderComponent = props =>
    render(
      <ChakraThemeWrapper>
        <ThemeWrapper>
          <IconTooltipPanel {...props} />
        </ThemeWrapper>
      </ChakraThemeWrapper>,
    );

  describe('With empty properties', () => {
    it('should render nothing', () => {
      const component = renderComponent({});
      expect(component.container).toBeEmptyDOMElement();
    });
  });

  describe('With properties', () => {
    let component;

    beforeEach(() => {
      component = renderComponent(props);
    });

    it('should render and match the snapshot', () => {
      expect(component).toMatchSnapshot();
    });

    it('should render text and values', () => {
      const { getByText } = component;
      expect(getByText(props.items[0].label)).toBeDefined();
      expect(getByText(props.items[1].label)).toBeDefined();
      expect(getByText(props.items[0].value)).toBeDefined();
      expect(getByText(props.items[1].value)).toBeDefined();
    });
  });
});
