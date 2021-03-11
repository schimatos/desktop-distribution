import * as url from 'url';
import Requester from '../lib/Requester';
const mockSetup = require('./__mocks__/follow-redirects').mockSetup;

describe('Requester', () => {
  it('also works with parsed URL objects', () => {
    mockSetup({ statusCode: 405 });
    const requester = new Requester();
    const req = requester.createRequest(url.parse('http://example.com/test'));
    return new Promise(resolve => {
      req.on('response', response => {
        expect(response).toMatchObject({ statusCode: 405 });
        expect(response.input).toMatchObject({ href: 'http://example.com/test' });
        // @ts-ignore
        resolve();
      });
    });
  });

  describe('convertRequestHeadersToFetchHeaders', () => {
    it('works with response headers', () => {
      const requester = new Requester();
      const req = requester.createRequest(url.parse('http://example.com/test'));
      return new Promise(resolve => {
        req.on('response', response => {
          response.headers = { accept: 'more' };
          expect(requester.convertRequestHeadersToFetchHeaders(response.headers))
            .toEqual(new Headers({ accept: 'more' }));
          // @ts-ignore
          resolve();
        });
      });
    });

    it('works without headers', () => {
      const requester = new Requester();
      const req = requester.createRequest(url.parse('http://example.com/test'));
      return new Promise(resolve => {
        req.on('response', response => {
          response.headers = {};
          expect(requester.convertRequestHeadersToFetchHeaders(response.headers)).toEqual(new Headers({}));
          // @ts-ignore
          resolve();
        });
      });
    });
  });
});
