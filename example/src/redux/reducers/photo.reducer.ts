import { INITIAL_PAGE_NO } from "../../constants/app.constants";
import { PhotoServiceTypes } from "../../services/types";
import { PhotoActions } from "../type";

const initialState: {
	searchResult?: PhotoServiceTypes.Photo[];
} = {
	searchResult: undefined
};

const photoReducer = (
	state = initialState,
	action: { type: PhotoActions; payload: any }
) => {
	switch (action.type) {
		case PhotoActions.SearchResult:
			return {
				...state,
				searchResult: action.payload
					? (action.payload as PhotoServiceTypes.Photos).page ===
							INITIAL_PAGE_NO || !state.searchResult
						? (action.payload.photo as PhotoServiceTypes.Photo[])
						: ([
								...state.searchResult,
								...action.payload.photo
						  ] as PhotoServiceTypes.Photo[])
					: undefined
			};
		default:
			return state;
	}
};
export default photoReducer;
