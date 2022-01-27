import { Auth0ClientOptions } from '../src/global';
import * as scope from '../src/scope';

// Prevent webextension-polyfill from complaining during unit tests
// @ts-ignore
window.chrome = {
  runtime: {
    id: 'testid',
  },
};

jest.mock('../src/jwt');
jest.mock('../src/utils');
jest.mock('../src/api');

import createAuth0Client, { Auth0Client } from '../src/index';

import {
  TEST_REDIRECT_URI,
  TEST_ACCESS_TOKEN,
  TEST_ARRAY_BUFFER,
  TEST_BASE64_ENCODED_STRING,
  TEST_CLIENT_ID,
  TEST_DOMAIN,
  TEST_ENCODED_STATE,
  TEST_ID_TOKEN,
  TEST_QUERY_PARAMS,
  TEST_RANDOM_STRING,
  TEST_USER_ID,
} from './constants';

const setup = async (
  clientOptions: Partial<Auth0ClientOptions> = {},
  callConstructor = true
) => {
  const tokenVerifier = require('../src/jwt').verifyIdToken;
  const utils = require('../src/utils');
  const api = require('../src/api');

  utils.createQueryParams.mockReturnValue(TEST_QUERY_PARAMS);
  utils.encode.mockReturnValue(TEST_ENCODED_STATE);
  utils.createRandomString.mockReturnValue(TEST_RANDOM_STRING);
  utils.sha256.mockReturnValue(Promise.resolve(TEST_ARRAY_BUFFER));
  utils.bufferToBase64UrlEncoded.mockReturnValue(TEST_BASE64_ENCODED_STRING);

  api.oauthToken.mockReturnValue(
    Promise.resolve({
      id_token: TEST_ID_TOKEN,
      access_token: TEST_ACCESS_TOKEN,
    })
  );

  tokenVerifier.mockReturnValue({
    user: {
      sub: TEST_USER_ID,
    },
    claims: {
      sub: TEST_USER_ID,
      aud: TEST_CLIENT_ID,
    },
  });

  const popup = {
    location: { href: '' },
    close: jest.fn(),
  };

  const auth0 = callConstructor
    ? createAuth0Client({
        domain: TEST_DOMAIN,
        client_id: TEST_CLIENT_ID,
        redirect_uri: TEST_REDIRECT_URI,
        ...clientOptions,
      })
    : undefined;

  return {
    auth0,
    tokenVerifier,
    utils,
    popup,
    api,
  };
};

describe('Auth0', () => {
  const oldWindowLocation = window.location;
  let getUniqueScopesSpy;

  beforeEach(() => {
    // https://www.benmvp.com/blog/mocking-window-location-methods-jest-jsdom/
    delete window.location;
    window.location = Object.defineProperties(
      {},
      {
        ...Object.getOwnPropertyDescriptors(oldWindowLocation),
        assign: {
          configurable: true,
          value: jest.fn(),
        },
      }
    ) as Location;
    // --

    window.Worker = jest.fn();

    (<any>global).crypto = {
      subtle: {
        digest: () => '',
      },
    };

    getUniqueScopesSpy = jest.spyOn(scope, 'getUniqueScopes');
  });

  afterEach(() => {
    jest.clearAllMocks();
    getUniqueScopesSpy.mockRestore();
    window.location = oldWindowLocation;
  });

  describe('createAuth0Client()', () => {
    it('should create an Auth0 client', async () => {
      const auth0 = createAuth0Client({
        domain: TEST_DOMAIN,
        client_id: TEST_CLIENT_ID,
        redirect_uri: TEST_REDIRECT_URI,
      });

      expect(auth0).toBeInstanceOf(Auth0Client);
    });

    it('should call `utils.validateCrypto`', async () => {
      const { utils } = await setup();

      expect(utils.validateCrypto).toHaveBeenCalled();
    });

    it('should fail if an invalid cache location was given', async () => {
      expect(() =>
        createAuth0Client({
          domain: TEST_DOMAIN,
          client_id: TEST_CLIENT_ID,
          cacheLocation: 'dummy',
        } as any)
      ).toThrow(new Error(`Invalid cache location "dummy"`));
    });
  });
});
