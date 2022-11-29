import React, { useState } from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './../theme';

const CACHE_KEY = 'IS_DARK';

const ThemeContext = React.createContext({
  isDark: null,
  toggleTheme: () => {},
});

const ThemeProviderProxy: any = SCThemeProvider;

const ThemeContextProvider = ({ children }) => {
  const [isDark, setIsDark] = useState<any>(true);

  const toggleTheme = () => {
    setIsDark(prevState => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(!prevState));
      return !prevState;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ThemeProviderProxy theme={isDark ? darkTheme : lightTheme}>
        {children}
      </ThemeProviderProxy>
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeContextProvider };
