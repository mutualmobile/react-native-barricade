import { HttpMethod, SearchContentType } from "../constants/enum.constants";
import { apiConfig, NetworkManager } from "../network";
import { PhotoServiceTypes } from "./types";

export class PhotoService {
	static searchPhotos = (searchText: string, page: number, perPage = 20) => {
		return NetworkManager.getInstance().appRequest<PhotoServiceTypes.Photos>(
			{
				method: HttpMethod.GET,
				url: apiConfig.photos.search,
				params: {
					text: searchText,
					content_type: SearchContentType.Photos,
					page,
					per_page: perPage
				}
			}
		);
	};
}
