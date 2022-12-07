import env from "../config";
import { ImageSizeSuffix } from "../constants/enum.constants";
import { PhotoServiceTypes } from "../services/types";

export const getImageUrl = (
	item: PhotoServiceTypes.Photo,
	size: ImageSizeSuffix
) => {
	return `${env.imageBaseUrl}${item.server}/${item.id}_${item.secret}_${size}.jpg`;
};
