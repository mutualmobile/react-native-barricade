import { Strings } from '../../assets';
import { HttpStatus } from '../../constants';
import { PhotoService, PhotoServiceTypes } from '../../services';
import { AppDispatch } from '../store';
import { PhotoActions } from '../type';

export function getSearchResults(searchText: string, page: number) {
  return (dispatch: AppDispatch) => {
    return PhotoService.searchPhotos(searchText, page)
      .then(response => {
        if (response.stat === HttpStatus.ok) {
          dispatch(setSearchResults(response.photos));
        } else {
          dispatch(
            setSearchError(
              response.message ?? Strings.errorMessage.something_went_wrong,
            ),
          );
        }
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

export function setSearchError(message?: string) {
  return {
    type: PhotoActions.SearchError,
    payload: message ?? Strings.errorMessage.something_went_wrong,
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

export function setRecentError(message?: string) {
  return {
    type: PhotoActions.RecentError,
    payload: message ?? Strings.errorMessage.something_went_wrong,
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
        if (response.stat === HttpStatus.ok) {
          dispatch(setRecentResults(response.photos));
        } else {
          dispatch(
            setRecentError(
              response.message ?? Strings.errorMessage.something_went_wrong,
            ),
          );
        }
        return response;
      })
      .catch(error => {
        dispatch(setRecentError(error.data.message));
      });
  };
}

export function apiTestResult() {
  return (dispatch: AppDispatch) => {
    return PhotoService.apiTest()
      .then(response => {
        return response;
      })
      .catch(error => {
        console.log('🚀 ~ file: photo-action.ts:95 ~ return ~ error', error);
        // dispatch(setSearchError(error.data.message));
      });
  };
}
