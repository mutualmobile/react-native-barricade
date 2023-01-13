import urlParse from 'url-parse';

export class UrlUtils {
  static parseURL(url: string) {
    const parsedUrl = new urlParse(url);

    let pathname = parsedUrl.pathname;
    if (pathname.charAt(0) !== '/') {
      pathname = '/' + pathname;
    }

    let params: Record<string, string> | undefined;
    if (parsedUrl.query) {
      params = UrlUtils.getQueryParamsObj(parsedUrl.query);
    }

    return {
      ...parsedUrl,
      params,
      pathname: pathname,
      fullpath: pathname + (parsedUrl.query || '') + (parsedUrl.hash || ''),
    };
  }

  static getQueryParamsObj(query: string) {
    return query
      ? query
          .slice(1)
          .split('&')
          .reduce(function (
            previousValue: Record<string, string>,
            currentValue,
          ) {
            const keyValuePair = currentValue.split('=');
            previousValue[decodeURIComponent(keyValuePair[0])] =
              decodeURIComponent(keyValuePair[1]);
            return previousValue;
          },
          {})
      : undefined;
  }
}
