import { Env } from '../config';
import { ImageSizeSuffix } from '../constants';
import { PhotoServiceTypes } from '../services';

export const getImageUrl = (
  item: PhotoServiceTypes.Photo,
  size: ImageSizeSuffix,
) => {
  return `${Env.imageBaseUrl}/${item.server}/${item.id}_${item.secret}_${size}.jpg`;
};
