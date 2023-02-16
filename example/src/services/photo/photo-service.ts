import { Env } from '../../config';
import { HttpMethod, SearchContentType } from '../../constants';
import { apiConfig, NetworkManager } from '../../network';
import { PhotoServiceTypes } from './type';

export class PhotoService {
  static searchPhotos = (searchText: string, page: number, perPage = 20) => {
    return NetworkManager.getInstance().appRequest<PhotoServiceTypes.PhotosResponseData>(
      {
        method: HttpMethod.GET,
        url: apiConfig.photos.search,
        params: {
          text: searchText,
          content_type: SearchContentType.Photos,
          page,
          per_page: perPage,
        },
      },
    );
  };

  static getPhotoInfo = (photoId: string) => {
    return fetch(
      `${Env.baseUrl}${apiConfig.photos.info}&photo_id=${photoId}&api_key=${Env.flickrKey}&format=json&nojsoncallback=1`,
      {
        method: HttpMethod.GET,
      },
    ).then(response => {
      return response.json();
    });
  };

  static getRecentPhotos = (page: number) => {
    return NetworkManager.getInstance().appRequest<PhotoServiceTypes.PhotosResponseData>(
      {
        method: HttpMethod.GET,
        url: apiConfig.photos.recent,
        params: {
          content_type: SearchContentType.Photos,
          page,
          per_page: 20,
        },
      },
    );
  };

  static apiTest = () => {
    return NetworkManager.getInstance().appRequest({
      method: HttpMethod.GET,
      url: apiConfig.photos.error,
      params: {
        // content_type: SearchContentType.Photos,
        // page,
        // per_page: 20,
      },
    });
  };
}
