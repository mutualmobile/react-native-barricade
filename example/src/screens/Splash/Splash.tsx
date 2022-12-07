import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import SplashScreen from "react-native-splash-screen";

import { Colors, Fonts, Images } from "../../assets";
import {
	GeneralStackParamList,
	GeneralStackRouteName
} from "../../navigation/type";
import { horizontalScale, verticalScale } from "../../utilities";

type Props = NativeStackScreenProps<
	GeneralStackParamList,
	GeneralStackRouteName.Splash
>;
export const Splash = ({ navigation }: Props) => {
	useEffect(() => {
		setTimeout(() => {
			SplashScreen.hide();
			navigation.replace(GeneralStackRouteName.Home);
		}, 3000);
	}, []);

	return (
		<View style={styles.container}>
			<Image source={Images.logo} style={styles.logo} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.bgPrimary,
		padding: horizontalScale(20)
	},
	logo: {
		height: verticalScale(70),
		width: horizontalScale(200)
	}
});
