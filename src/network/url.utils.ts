import urlParse from 'url-parse';

export class UrlUtils {
  static parseURL(url: string) {
    const parsedUrl = new urlParse(url);

    let pathname = parsedUrl.pathname;
    if (pathname.charAt(0) !== '/') {
      pathname = '/' + pathname;
    }

    return {
      host: parsedUrl.host,
      protocol: parsedUrl.protocol,
      search: parsedUrl.query,
      hash: parsedUrl.hash,
      href: parsedUrl.href,
      pathname: pathname,
      fullpath: pathname + (parsedUrl.query || '') + (parsedUrl.hash || ''),
    };
  }
}
