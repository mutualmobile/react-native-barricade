import { useMemo } from 'react';

import { DarkThemeColors, LightThemeColors } from './colors';
import { ColorType } from './colors.type';
import { useTheme } from './useTheme';

const getColorStyle = (props: ColorType) => {
  return {
    background: { backgroundColor: props.background },
    overlay: { backgroundColor: props.overlay },
    surface: { backgroundColor: props.surface },
    onSurface: { backgroundColor: props.onSurface },
    onBackground: { backgroundColor: props.onBackground },

    primary: { color: props.primary },
    onPrimary: { color: props.onPrimary },

    secondary: { color: props.secondary },
    onSecondary: { color: props.onSecondary },

    textLight: { color: props.textLight },
    textDark: { color: props.textDark },

    border: { borderColor: props.border },

    error: { color: props.error },
    success: { color: props.success },
    warning: { color: props.warning },
  };
};

const useThemedColor = () => {
  const theme = useTheme();

  const colors = theme === 'dark' ? DarkThemeColors : LightThemeColors;
  const themeColorStyle = useMemo(() => getColorStyle(colors), [colors]);

  return {
    themeColorStyle,
  };
};

export { useThemedColor };
