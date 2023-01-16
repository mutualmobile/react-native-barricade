import { Strings } from '../../assets';
import { INITIAL_PAGE_NO } from '../../constants';
import { PhotoServiceTypes } from '../../services';
import { PhotoActions } from '../type';

const initialState: {
  recentError?: string;
  recentPage: number;
  recentResult?: PhotoServiceTypes.Photo[];
  recentTotalPages: number;
  searchError?: string;
  searchPage: number;
  searchResult?: PhotoServiceTypes.Photo[];
  searchTotalPages: number;
} = {
  recentError: undefined,
  recentPage: INITIAL_PAGE_NO,
  recentResult: undefined,
  recentTotalPages: INITIAL_PAGE_NO,
  searchError: undefined,
  searchPage: INITIAL_PAGE_NO,
  searchResult: undefined,
  searchTotalPages: INITIAL_PAGE_NO,
};

export const photoReducer = (
  state = initialState,
  action: { type: PhotoActions; payload: any },
) => {
  switch (action.type) {
    case PhotoActions.RecentError:
      return {
        ...state,
        recentError: action.payload,
      };
    case PhotoActions.RecentResult:
      return action.payload
        ? {
            ...state,
            recentError:
              (action.payload as PhotoServiceTypes.Photos).page ===
                INITIAL_PAGE_NO ||
              (!state.recentResult && action.payload.photo?.length === 0)
                ? Strings.home.recent_no_data
                : undefined,
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
    case PhotoActions.ResetRecentResult:
      return {
        ...state,
        recentError: undefined,
        recentPage: INITIAL_PAGE_NO,
        recentResult: undefined,
        recentTotalPages: INITIAL_PAGE_NO,
      };
    case PhotoActions.ResetSearchResult:
      return {
        ...state,
        searchError: undefined,
        searchPage: INITIAL_PAGE_NO,
        searchResult: undefined,
        searchTotalPages: INITIAL_PAGE_NO,
      };
    case PhotoActions.SearchError:
      return {
        ...state,
        searchError: action.payload,
      };
    case PhotoActions.SearchResult:
      return action.payload
        ? {
            ...state,
            searchError:
              (action.payload as PhotoServiceTypes.Photos).page ===
                INITIAL_PAGE_NO ||
              (!state.recentResult && action.payload.photo?.length === 0)
                ? Strings.home.search_no_data
                : undefined,
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
