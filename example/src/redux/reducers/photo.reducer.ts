import { INITIAL_PAGE_NO } from '../../constants/app.constants';
import { PhotoServiceTypes } from '../../services/types';
import { PhotoActions } from '../type';

const initialState: {
  recentPage: number;
  recentResult?: PhotoServiceTypes.Photo[];
  recentTotalPages: number;
  searchPage: number;
  searchResult?: PhotoServiceTypes.Photo[];
  searchTotalPages: number;
} = {
  recentPage: INITIAL_PAGE_NO,
  recentResult: undefined,
  recentTotalPages: INITIAL_PAGE_NO,
  searchPage: INITIAL_PAGE_NO,
  searchResult: undefined,
  searchTotalPages: INITIAL_PAGE_NO,
};

const photoReducer = (
  state = initialState,
  action: { type: PhotoActions; payload: any },
) => {
  switch (action.type) {
    case PhotoActions.RecentResult:
      return action.payload
        ? {
            ...state,
            recentPage: (action.payload as PhotoServiceTypes.Photos).page + 1,
            recentResult:
              (action.payload as PhotoServiceTypes.Photos).page ===
                INITIAL_PAGE_NO || !state.recentResult
                ? (action.payload.photo as PhotoServiceTypes.Photo[])
                : ([
                    ...state.recentResult,
                    ...action.payload.photo,
                  ] as PhotoServiceTypes.Photo[]),
            recentTotalPages: (action.payload as PhotoServiceTypes.Photos)
              .pages,
          }
        : state;
    case PhotoActions.ResetSearchResult:
      return {
        ...state,
        searchPage: INITIAL_PAGE_NO,
        searchResult: undefined,
        searchTotalPages: INITIAL_PAGE_NO,
      };
    case PhotoActions.SearchResult:
      return action.payload
        ? {
            ...state,
            searchPage: (action.payload as PhotoServiceTypes.Photos).page + 1,
            searchResult:
              (action.payload as PhotoServiceTypes.Photos).page ===
                INITIAL_PAGE_NO || !state.searchResult
                ? (action.payload.photo as PhotoServiceTypes.Photo[])
                : ([
                    ...state.searchResult,
                    ...action.payload.photo,
                  ] as PhotoServiceTypes.Photo[]),
            searchTotalPages: (action.payload as PhotoServiceTypes.Photos)
              .pages,
          }
        : state;
    default:
      return state;
  }
};
export default photoReducer;
