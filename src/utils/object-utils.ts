import cloneDeep from 'lodash.clonedeep';

export class ObjectUtils {
  static cloneDeep<T>(value: T) {
    try {
      return cloneDeep(value);
    } catch {
      return value;
    }
  }
}
