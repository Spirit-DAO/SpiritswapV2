import { createRenderer } from 'react-test-renderer/shallow';
import { App } from '../index';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { Provider } from 'react-redux';
import { store } from 'store';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

const renderer = createRenderer();

describe('<App />', () => {
  xit('should render and match the snapshot', () => {
    renderer.render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    const renderedOutput = renderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
