import { PhotoService } from "../../services/photo.service";
import { PhotoServiceTypes } from "../../services/types";
import { AppDispatch } from "../store";
import { PhotoActions } from "../type";

export function setSearchResults(photos?: PhotoServiceTypes.Photos) {
	return {
		type: PhotoActions.SearchResult,
		payload: photos
	};
}

export function getSearchResults(searchText: string, page: number) {
	return (dispatch: AppDispatch) => {
		return PhotoService.searchPhotos(searchText, page).then(response => {
			dispatch(setSearchResults(response?.photos));
			return response;
		});
	};
}
