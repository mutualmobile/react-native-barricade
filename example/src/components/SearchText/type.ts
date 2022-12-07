import { TextInputProps } from "react-native";

export interface SearchTextProps extends TextInputProps {
	onChangeText: (text: string) => void;
}
