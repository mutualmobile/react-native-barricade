import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Colors, Fonts } from "../../assets";
import { ImageSizeSuffix } from "../../constants/enum.constants";
import {
	GeneralStackParamList,
	GeneralStackRouteName
} from "../../navigation/type";
import { getImageUrl, horizontalScale, verticalScale } from "../../utilities";

type Props = NativeStackScreenProps<
	GeneralStackParamList,
	GeneralStackRouteName.Details
>;
export const Details = ({ navigation, route }: Props) => {
	const { data } = route.params;
	return (
		<View style={styles.container}>
			<Image
				style={styles.img}
				source={{
					uri: getImageUrl(data, ImageSizeSuffix.Large)
				}}
				resizeMode="cover"
			/>
			<Text style={styles.message} numberOfLines={3}>
				{data.title}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		backgroundColor: Colors.bgPrimary,
		padding: horizontalScale(20)
	},
	message: {
		color: Colors.body,
		fontFamily: Fonts.Bold,
		fontSize: horizontalScale(20),
		marginTop: verticalScale(10),
		textAlign: "left"
	},
	img: {
		width: "100%",
		height: "80%"
	}
});
