import { ObjectUtils } from '../../utils';

describe('given that cloneDeep is called,', () => {
  test('when source is null, should return null and not throw error', () => {
    let source = null;
    const result = ObjectUtils.cloneDeep(source);
    expect(result).toBe(null);
    expect.assertions(1);
  });

  test('when source is object, should return new object which is deep copied', () => {
    let source = { test: true };

    const result = ObjectUtils.cloneDeep(source);
    expect(result).toMatchObject({ test: true });

    source.test = false;
    expect(JSON.stringify(source)).not.toEqual(JSON.stringify(result));

    expect.assertions(2);
  });
});
