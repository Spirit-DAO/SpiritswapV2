import { addDecorator } from '@storybook/react';
import { withThemesProvider } from 'storybook-addon-styled-component-theme';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from 'theme';
import { i18n } from './i18n';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { default as theme } from 'theme/chakra/theme';

const themes = [darkTheme, lightTheme];
addDecorator(withThemesProvider(themes), ThemeProvider);
addDecorator(storyFn => (
  <ChakraProvider theme={theme}>
    <CSSReset />
    {storyFn()}
  </ChakraProvider>
));

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // `BackgroundsParameter` is here:
  // https://github.com/storybookjs/storybook/blob/0cf9d0a682c806efe8e0807cb58699596ce04703/addons/backgrounds/src/types/index.ts#L22
  backgrounds: {
    values: [
      {
        name: 'Dark',
        value: '#3F3D3D',
      },
    ],
    default: 'Dark',
  },
  i18n,
  locale: 'en',
  locales: {
    en: 'English',
    es: 'Español',
  },
};
