import { ColorType } from './colors.type';

const Colors = {
  primary: '#007aa3',
  onPrimary: '#ffffff',

  secondary: '#000032',
  onSecondary: '#ffffff',

  background: '#EBEBEB',
  onBackground: '#181818',

  surface: '#ffffff',
  onSurface: '#2D2D2D',

  neutral0: '#ffffff',
  neutral20: '#F9F9F9',
  neutral30: '#EBEBEB',
  neutral40: '#DEDEDE',
  neutral50: '#BFBFC0',
  neutral60: '#949497',
  neutral70: '#69696D',
  neutral75: '#404040',
  neutral80: '#2D2D2D',
  neutral90: '#181818',
  neutral100: '#000000',

  error: '#EE0003',
  warning: '#FFD600',
  success: '#00EA6E',
};

export const LightThemeColors: ColorType = {
  background: Colors.background,
  overlay: Colors.onBackground,
  surface: Colors.surface,
  onSurface: Colors.onSurface,
  onBackground: Colors.onBackground,

  primary: Colors.primary,
  onPrimary: Colors.onPrimary,

  secondary: Colors.secondary,
  onSecondary: Colors.onSecondary,

  textLight: Colors.neutral70,
  textDark: Colors.neutral90,

  border: Colors.neutral40,

  error: Colors.error,
  success: Colors.success,
  warning: Colors.warning,
};

export const DarkThemeColors: ColorType = {
  background: Colors.onBackground,
  overlay: Colors.onSurface,
  surface: Colors.onSurface,
  onSurface: Colors.surface,
  onBackground: Colors.background,

  primary: Colors.primary,
  onPrimary: Colors.onPrimary,

  secondary: Colors.secondary,
  onSecondary: Colors.onSecondary,

  textLight: Colors.neutral30,
  textDark: Colors.neutral0,

  border: Colors.neutral70,

  error: Colors.error,
  success: Colors.success,
  warning: Colors.warning,
};
