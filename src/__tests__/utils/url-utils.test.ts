import { UrlUtils } from '../../utils';

const URL = 'https://api.flickr.com/services/rest?method=flickr.photos.search';

describe('given that parseURL is called,', () => {
  test('when url is null, should return parsed URL object with default values', () => {
    // @ts-ignore
    const result = UrlUtils.parseURL(null);
    expect(result).toMatchObject({
      auth: '',
      fullpath: '/',
      hash: '',
      host: '',
      hostname: '',
      href: '',
      origin: 'null',
      params: undefined,
      password: '',
      pathname: '/',
      port: '',
      protocol: '',
      query: '',
      slashes: false,
      username: '',
    });
    expect.assertions(1);
  });

  test('when url is empty, should return parsed URL object with default values', () => {
    const result = UrlUtils.parseURL('');
    expect(result).toMatchObject({
      auth: '',
      fullpath: '/',
      hash: '',
      host: '',
      hostname: '',
      href: '',
      origin: 'null',
      params: undefined,
      password: '',
      pathname: '/',
      port: '',
      protocol: '',
      query: '',
      slashes: false,
      username: '',
    });
    expect.assertions(1);
  });

  test('when an invalid url is passed, should return parsed URL object with fullpath, href and pathname', () => {
    const result = UrlUtils.parseURL('test');
    expect(result).toMatchObject({
      auth: '',
      fullpath: '/test',
      hash: '',
      host: '',
      hostname: '',
      href: 'test',
      origin: 'null',
      params: undefined,
      password: '',
      pathname: '/test',
      port: '',
      protocol: '',
      query: '',
      slashes: false,
      username: '',
    });
    expect.assertions(1);
  });

  test('when an valid url is passed, should return parsed URL object', () => {
    const result = UrlUtils.parseURL(URL);
    expect(result).toMatchObject({
      auth: '',
      fullpath: '/services/rest?method=flickr.photos.search',
      hash: '',
      host: 'api.flickr.com',
      hostname: 'api.flickr.com',
      href: 'https://api.flickr.com/services/rest?method=flickr.photos.search',
      origin: 'https://api.flickr.com',
      params: {
        method: 'flickr.photos.search',
      },
      password: '',
      pathname: '/services/rest',
      port: '',
      protocol: 'https:',
      query: '?method=flickr.photos.search',
      slashes: true,
      username: '',
    });
    expect.assertions(1);
  });
});

describe('given that getQueryParamsObj is called,', () => {
  test('when params is null, should return undefined', () => {
    // @ts-ignore
    const result = UrlUtils.getQueryParamsObj(null);
    expect(result).toBe(undefined);
    expect.assertions(1);
  });

  test('when params is empty string, should return undefined', () => {
    const result = UrlUtils.getQueryParamsObj('');
    expect(result).toBe(undefined);
    expect.assertions(1);
  });

  test('when an invalid query string is passed, should not throw error and return an object', () => {
    const result = UrlUtils.getQueryParamsObj('test');
    expect(result).toMatchObject({ est: 'undefined' });
    expect.assertions(1);
  });

  test('when an valid query string is passed, should return params object', () => {
    const result = UrlUtils.getQueryParamsObj(
      '?method=flickr.photos.search&limit=10',
    );
    expect(result).toMatchObject({
      method: 'flickr.photos.search',
      limit: '10',
    });
    expect.assertions(1);
  });
});
