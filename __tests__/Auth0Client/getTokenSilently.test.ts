import * as utils from '../../src/utils';

import // loginWithRedirectFn
'./helpers';

import {
  TEST_DOMAIN,
  TEST_CLIENT_ID,
  TEST_REDIRECT_URI,
  TEST_CODE_CHALLENGE,
  TEST_ID_TOKEN,
  TEST_ACCESS_TOKEN,
  TEST_REFRESH_TOKEN,
  TEST_SCOPES,
  TEST_AUDIENCE,
} from '../constants';

import { GetTokenSilentlyResult } from '../../src/global';

import { verifyIdToken } from '../../src/jwt';
import Auth0Client from '../../src/Auth0Client';
import browser from 'webextension-polyfill';

jest.mock('../../src/lock/index');
jest.mock('../../src/jwt');

const mockWindow = <any>global;
const mockVerify = <jest.Mock>verifyIdToken;
const tokenVerifier = require('../../src/jwt').verifyIdToken;

jest
  .spyOn(utils, 'bufferToBase64UrlEncoded')
  .mockReturnValue(TEST_CODE_CHALLENGE);

describe('Auth0Client', () => {
  beforeEach(() => {});

  afterEach(async () => {
    await browser.storage.local.clear();
  });

  describe('getTokenSilently', () => {
    it('uses the cache when expires_in > constant leeway', async () => {
      mockWindow.crypto = {
        subtle: {
          digest: () => 'foo',
        },
        getRandomValues() {
          return '123';
        },
      };

      mockVerify.mockReturnValue({
        claims: Object.assign({
          exp: Date.now() / 1000 + 86400,
        }),
        user: {
          sub: 'me',
        },
      });

      const result: GetTokenSilentlyResult = {
        id_token: TEST_ID_TOKEN,
        access_token: TEST_ACCESS_TOKEN,
        refresh_token: TEST_REFRESH_TOKEN,
        expires_in: 86400,
        scope: TEST_SCOPES,
        oauthTokenScope: TEST_SCOPES,
        audience: TEST_AUDIENCE,
        decodedToken: {
          encoded: {
            header: '',
            payload: '',
            signature: '',
          },
          header: {},
          claims: {
            __raw: '',
          },
          user: {},
        },
      };

      const getToken = jest
        .spyOn(Auth0Client.prototype as any, '_getTokenFromIFrame')
        .mockReturnValue(result);

      const auth0 = new Auth0Client({
        domain: TEST_DOMAIN,
        client_id: TEST_CLIENT_ID,
        redirect_uri: TEST_REDIRECT_URI,
      });

      const token = await auth0.getTokenSilently();

      expect(getToken).toHaveBeenCalled();
    });
  });
});
