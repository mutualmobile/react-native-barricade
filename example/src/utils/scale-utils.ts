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
