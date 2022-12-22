import { PhotoService } from '../../services/photo.service';
import { PhotoServiceTypes } from '../../services/types';
import { AppDispatch } from '../store';
import { PhotoActions } from '../type';

export function getSearchResults(searchText: string, page: number) {
  return (dispatch: AppDispatch) => {
    return PhotoService.searchPhotos(searchText, page)
      .then(response => {
        dispatch(setSearchResults(response?.photos));
        return response;
      })
      .catch(error => {
        dispatch(setSearchError(error.data.message));
      });
  };
}

export function resetSearchResults() {
  return {
    type: PhotoActions.ResetSearchResult,
  };
}

export function setSearchError(message: string) {
  return {
    type: PhotoActions.SearchError,
    payload: message,
  };
}

export function setSearchResults(photos?: PhotoServiceTypes.Photos) {
  return {
    type: PhotoActions.SearchResult,
    payload: photos,
  };
}

export function resetRecentResults() {
  return {
    type: PhotoActions.ResetRecentResult,
  };
}

export function setRecentError(message: string) {
  return {
    type: PhotoActions.RecentError,
    payload: message,
  };
}

export function setRecentResults(photos?: PhotoServiceTypes.Photos) {
  return {
    type: PhotoActions.RecentResult,
    payload: photos,
  };
}

export function getRecentResults(page: number) {
  return (dispatch: AppDispatch) => {
    return PhotoService.getRecentPhotos(page)
      .then(response => {
        dispatch(setRecentResults(response?.photos));
        return response;
      })
      .catch(error => {
        dispatch(setRecentError(error.data.message));
      });
  };
}
