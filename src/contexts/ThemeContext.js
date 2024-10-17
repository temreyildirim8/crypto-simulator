// src/contexts/ThemeContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightColors, darkColors } from '../utils/colors';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? darkColors.background : lightColors.background,
        paper: darkMode ? darkColors.orderHistoryBackground : lightColors.orderHistoryBackground,
      },
      text: {
        primary: darkMode ? darkColors.text : lightColors.text,
      },
      primary: {
        main: darkMode ? darkColors.primary : lightColors.primary,
      },
      secondary: {
        main: darkMode ? darkColors.secondary : lightColors.secondary,
      },
      customBlue: {
        main: darkMode ? darkColors.customBlue : lightColors.customBlue,
      },
      orderHistory: {
        itemBackground: darkMode ? darkColors.orderItemBackground : lightColors.orderItemBackground,
        itemText: darkMode ? darkColors.orderItemText : lightColors.orderItemText,
        transparent: darkMode ? darkColors.orderHistoryTransparent : lightColors.orderHistoryTransparent,
        darkGray: darkMode ? darkColors.orderHistoryDarkGray : lightColors.orderHistoryDarkGray,
        lightGray: darkMode ? darkColors.orderHistoryLightGray : lightColors.orderHistoryLightGray,
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};