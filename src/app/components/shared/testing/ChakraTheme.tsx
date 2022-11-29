import { ChakraThemeProvider } from 'theme/chakra';

export const ChakraThemeWrapper = ({ children, ...props }) => {
  return <ChakraThemeProvider {...props}>{children}</ChakraThemeProvider>;
};
