import { fireEvent, render, screen } from '@testing-library/react';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { ChakraThemeWrapper } from 'app/components/shared/testing/ChakraTheme';
import { QuestionHelper } from '..';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe(`<QuestionHelper />`, () => {
  const renderComponent = () =>
    render(
      <ChakraThemeWrapper>
        <QuestionHelper title="testTitle" text="text test" showDocs />
      </ChakraThemeWrapper>,
    );

  it('should render and match the snapshot', () => {
    const component = renderComponent();
    expect(component).toMatchSnapshot();
  });

  it('The modal should be shown', () => {
    render(<QuestionHelper title="testTitle" text="text test" showDocs />);
    const modal = fireEvent.click(screen.getByTestId('open-modal-button'));
    expect(modal).toBeTruthy();
  });

  it('The title and the text content should be the same as the props', () => {
    render(<QuestionHelper title="testTitle" text="text test" showDocs />);
    fireEvent.click(screen.getByTestId('open-modal-button'));
    const title = screen.getByTestId('title');
    expect(title).toHaveTextContent('testTitle');
  });

  it('The textContent should be the same as the prop', () => {
    render(<QuestionHelper title="testTitle" text="text test" showDocs />);
    fireEvent.click(screen.getByTestId('open-modal-button'));
    const textContent = screen.getByTestId('textContent');
    expect(textContent).toHaveTextContent('text test');
  });
});
