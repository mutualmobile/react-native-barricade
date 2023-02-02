import { Env } from '../config';
import { ImageSizeSuffix } from '../constants';

export const getImageUrl = (
  id: string,
  secret: string,
  server: String,
  size: ImageSizeSuffix,
) => {
  return `${Env.imageBaseUrl}/${server}/${id}_${secret}_${size}.jpg`;
};
