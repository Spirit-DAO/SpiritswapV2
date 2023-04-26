// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'jest-styled-components';
import 'jest-canvas-mock';

// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => jest.fn(),
}));

jest.mock('react-chartjs-2', () => ({
  Bar: () => null,
  Line: () => null,
  Pie: () => null,
}));

jest.mock('react-dom', () => {
  const original = jest.requireActual('react-dom-17');
  return {
    ...original,
    createPortal: node => node,
  };
});

jest.mock('react', () => {
  return jest.requireActual('react-17');
});

jest.mock('react-dom/test-utils', () => {
  return jest.requireActual('react-dom-17/test-utils');
});

jest.mock('react-redux', () => {
  return jest.requireActual('react-redux-17');
});

jest.mock('@chakra-ui/react', () => {
  return jest.requireActual('@chakra-ui-17/react');
});
