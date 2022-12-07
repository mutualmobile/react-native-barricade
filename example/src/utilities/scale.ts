import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

//iPhone X Resolution: 375 x 812 dp.
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
	size + (horizontalScale(size) - size) * factor;

export {
	guidelineBaseHeight,
	guidelineBaseWidth,
	horizontalScale,
	verticalScale,
	moderateScale
};
