import { StyleSheet, TextInput } from "react-native";
import React from "react";

import { SearchTextProps } from "./type";
import { horizontalScale, verticalScale } from "../../utilities";
import { Colors, Fonts, Strings } from "../../assets";

export const SearchText = (props: SearchTextProps) => {
	const onChangeText = (text: string) => {
		// TODO: Do any required validation here
		props.onChangeText(text);
	};

	return (
		<TextInput
			value={props.value}
			style={[styles.input, props.style]}
			placeholder={Strings.input.search_placeholder}
			onChangeText={onChangeText}
			underlineColorAndroid={Colors.transparent}
		/>
	);
};

const styles = StyleSheet.create({
	input: {
		height: verticalScale(50),
		color: Colors.body,
		fontFamily: Fonts.Semibold,
		fontSize: horizontalScale(20),
		borderRadius: horizontalScale(12),
		borderColor: Colors.border,
		borderWidth: StyleSheet.hairlineWidth,
		paddingHorizontal: horizontalScale(12)
	}
});
