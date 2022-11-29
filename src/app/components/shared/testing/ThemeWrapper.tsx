import ThemeProvider from 'theme';

export const ThemeWrapper = ({ children, ...props }) => {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
};
