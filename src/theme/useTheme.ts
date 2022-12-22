import React, { useContext } from 'react';
import { ColorSchemeName } from 'react-native';

export type ThemeType = NonNullable<ColorSchemeName>;
const ThemeContext = React.createContext<ThemeType>('light');
export const ThemeProvider = ThemeContext.Provider;

const useTheme = () => useContext(ThemeContext);

export { useTheme };
