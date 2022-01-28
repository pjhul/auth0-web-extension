import 'fast-text-encoding';

import {
  createQueryParams,
  bufferToBase64UrlEncoded,
  createRandomString,
  createSecureRandomString,
  encode,
  decode,
  sha256,
  urlDecodeB64,
  getCrypto,
  getCryptoSubtle,
  validateCrypto,
} from '../src/utils';

(<any>global).TextEncoder = TextEncoder;

afterEach(() => {
  jest.resetAllMocks();
});

describe('utils', () => {
  describe('createQueryParams', () => {
    it('creates query string from object', () => {
      expect(
        createQueryParams({
          id: 1,
          value: 'test',
          url: 'http://example.com',
          nope: undefined,
        })
      ).toBe('id=1&value=test&url=http%3A%2F%2Fexample.com');
    });
  });

  describe('urlDecodeB64', () => {
    let oldATOB;
    beforeEach(() => {
      oldATOB = (<any>global).atob;
      (<any>global).atob = jest.fn(s => s);
    });

    afterEach(() => {
      (<any>global).atob = oldATOB;
    });

    it('decodes string correctly', () => {
      expect(urlDecodeB64('abc@123-_')).toBe('abc@123+/');
      expect(atob).toHaveBeenCalledWith('abc@123+/');
    });

    it('decodes string with utf-8 chars', () => {
      // restore atob to the default atob
      (<any>global).atob = oldATOB;

      // first we use encodeURIComponent to get percent-encoded UTF-8,
      // then we convert the percent encodings into raw bytes which
      // can be fed into btoa.
      // https://stackoverflow.com/questions/30106476/
      const b64EncodeUnicode = str =>
        btoa(
          encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCharCode(<any>('0x' + p1))
          )
        );
      const input = 'Błżicz@123!!';
      const encoded = b64EncodeUnicode(input);
      const output = urlDecodeB64(encoded);
      expect(output).toBe(input);
    });
  });

  describe('bufferToBase64UrlEncoded', () => {
    let oldBTOA;
    beforeEach(() => {
      oldBTOA = (<any>global).btoa;
      (<any>global).btoa = jest.fn(s => s);
    });

    afterEach(() => {
      (<any>global).btoa = oldBTOA;
    });

    it('decodes input in a safe way for urls', () => {
      const input = 'abc@123+/=';
      expect(bufferToBase64UrlEncoded(new TextEncoder().encode(input))).toBe(
        'abc@123-_'
      );
      expect(btoa).toHaveBeenCalledWith(input);
    });
  });

  describe('createRandomString', () => {
    it('creates random string of specified length', () => {
      expect(createRandomString(15)).toHaveLength(15);
    });
  });

  describe('createSecureRandomString', () => {
    it('creates random string based on crypto.getRandomValues', () => {
      (<any>global).crypto = {
        getRandomValues: () => [1, 5, 10, 15, 100],
      };
      expect(createSecureRandomString()).toBe('15AFY');
    });

    it('creates random string with a length between 43 and 128', () => {
      (<any>global).crypto = {
        getRandomValues: (a: Uint8Array) => Array(a.length).fill(0),
      };
      const result = createSecureRandomString();
      expect(result.length).toBeGreaterThanOrEqual(43);
      expect(result.length).toBeLessThanOrEqual(128);
    });
  });

  describe('encode', () => {
    it('encodes state', () => {
      expect(encode('test')).toBe('dGVzdA==');
    });
  });

  describe('decode', () => {
    it('decodes state', () => {
      expect(decode('dGVzdA==')).toBe('test');
    });
  });

  describe('sha256', () => {
    it('generates a digest of the given data', async () => {
      (<any>global).crypto = {
        subtle: {
          digest: jest.fn((alg, encoded) => {
            expect(alg).toMatchObject({ name: 'SHA-256' });
            expect(Array.from(encoded)).toMatchObject([116, 101, 115, 116]);
            return new Promise(res => res(true));
          }),
        },
      };
      const result = await sha256('test');
      expect(result).toBe(true);
    });
    /*it('handles ie11 digest.result scenario', () => {
      (<any>global).msCrypto = {};

      const digestResult = {
        oncomplete: null,
      };

      (<any>global).crypto = {
        subtle: {
          digest: jest.fn(() => {
            return digestResult;
          }),
        },
      };

      const sha = sha256('test').then(r => {
        expect(r).toBe(true);
      });

      digestResult.oncomplete?.({ target: { result: true } });

      return sha;
    });
    it('handles ie11 digest.result error scenario', () => {
      (<any>global).msCrypto = {};

      const digestResult = {
        onerror: null,
      };

      (<any>global).crypto = {
        subtle: {
          digest: jest.fn(() => {
            return digestResult;
          }),
        },
      };

      const sha = sha256('test').catch(e => {
        expect(e).toBe('An error occurred');
      });

      digestResult.onerror?.({ error: 'An error occurred' });

      return sha;
    });

    it('handles ie11 digest.result abort scenario', () => {
      (<any>global).msCrypto = {};

      const digestResult = {
        onabort: null,
      };

      (<any>global).crypto = {
        subtle: {
          digest: jest.fn(() => {
            return digestResult;
          }),
        },
      };

      const sha = sha256('test').catch(e => {
        expect(e).toBe('The digest operation was aborted');
      });

      digestResult.onabort?.();

      return sha;
    });*/
  });
  describe('bufferToBase64UrlEncoded ', () => {
    it('generates correct base64 encoded value from a buffer', async () => {
      const result = bufferToBase64UrlEncoded([116, 101, 115, 116]);
      expect(result).toBe('dGVzdA');
    });
  });

  describe('getCrypto', () => {
    it('should use msCrypto when window.crypto is unavailable', () => {
      (<any>global).crypto = undefined;
      (<any>global).msCrypto = 'ms';

      const theCrypto = getCrypto();
      expect(theCrypto).toBe('ms');
    });
    it('should use window.crypto when available', () => {
      (<any>global).crypto = 'window';
      (<any>global).msCrypto = 'ms';

      const theCrypto = getCrypto();
      expect(theCrypto).toBe('window');
    });
  });
  describe('getCryptoSubtle', () => {
    it('should use crypto.webkitSubtle when available', () => {
      (<any>global).crypto = { subtle: undefined, webkitSubtle: 'webkit' };

      const theSubtle = getCryptoSubtle();
      expect(theSubtle).toBe('webkit');
    });
    it('should use crypto.subtle when available', () => {
      (<any>global).crypto = { subtle: 'window', webkitSubtle: 'webkit' };

      const theSubtle = getCryptoSubtle();
      expect(theSubtle).toBe('window');
    });
    it('should use msCrypto.subtle when available', () => {
      (<any>global).crypto = undefined;
      (<any>global).msCrypto = { subtle: 'ms' };

      const cryptoSubtle = getCryptoSubtle();
      expect(cryptoSubtle).toBe('ms');
    });
  });
  describe('validateCrypto', () => {
    it('should throw error if crypto is unavailable', () => {
      (<any>global).crypto = undefined;
      (<any>global).msCrypto = undefined;

      expect(validateCrypto).toThrowError(
        'For security reasons, `window.crypto` is required to run `auth0-web-extension`.'
      );
    });
    it('should throw error if crypto.subtle is undefined', () => {
      (<any>global).crypto = {};

      expect(validateCrypto).toThrowError(`
      auth0-web-extension must run on a secure origin.
    `);
    });
  });
});
