import cloneDeep from 'lodash.clonedeep';

export class ObjectUtils {
  static cloneDeep<T>(value: T) {
    return cloneDeep(value);
  }
}
