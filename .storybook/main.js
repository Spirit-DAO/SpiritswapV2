module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    'storybook-addon-styled-component-theme/dist/preset',
    'storybook-react-i18next',
  ],
  refs: {
    '@chakra-ui/react': { disable: true },
  },
  features: {
    emotionAlias: false,
  },
};
