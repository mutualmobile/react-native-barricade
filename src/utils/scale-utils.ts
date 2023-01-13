import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');
const [usableWidth, usableHeight] =
  SCREEN_WIDTH < SCREEN_HEIGHT
    ? [SCREEN_WIDTH, SCREEN_HEIGHT]
    : [SCREEN_HEIGHT, SCREEN_WIDTH];

const guidelineBaseHeight = 812;
const guidelineBaseWidth = 375;

export const hScale = (size: number) =>
  (usableWidth / guidelineBaseWidth) * size;

export const vScale = (size: number) =>
  (usableHeight / guidelineBaseHeight) * size;

export const mScale = (size: number, factor = 0.5) =>
  size + (hScale(size) - size) * factor;

export const mvScale = (size: number, factor = 0.5) =>
  size + (vScale(size) - size) * factor;
