export const Colors = {
	bgPrimary: "#fff",

	primary: "#ff0084",
	secondary: "#0063dc",

	body: "#000",
	bodyAlt: "#fff",

	input: "#000",
	inputLabel: "#303030",
	placeholder: "#808080",

	border: "#808080",

	transparent: "transparent"
};

export function getColorWithOpacity(hex: string, opacity: number) {
	hex = hex.replace("#", "");
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	const result = "rgba(" + r + "," + g + "," + b + "," + opacity / 100 + ")";
	return result;
}
