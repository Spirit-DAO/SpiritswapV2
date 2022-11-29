import { ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import chakraTheme from './theme';

export interface Props {
  children: ReactNode;
}

const ChakraThemeProvider = ({ children }: Props) => (
  <ChakraProvider theme={chakraTheme} resetCSS={true}>
    {children}
  </ChakraProvider>
);

export default ChakraThemeProvider;
