import 'fast-text-encoding';
import * as utils from '../../src/utils';

import { setupFn, loginWithNewTabFn } from './helpers';

import { TEST_CODE_CHALLENGE, TEST_ACCESS_TOKEN } from '../constants';

import { verifyIdToken } from '../../src/jwt';
import browser from 'webextension-polyfill';

jest.mock('../../src/lock/index');
jest.mock('../../src/jwt');

(<any>global).fetch = jest.fn();

const mockFetch = <jest.Mock>(<any>global).fetch;
const mockWindow = <any>global;
const mockVerify = <jest.Mock>verifyIdToken;
const tokenVerifier = require('../../src/jwt').verifyIdToken;
const setup = setupFn(mockVerify);

jest
  .spyOn(utils, 'bufferToBase64UrlEncoded')
  .mockReturnValue(TEST_CODE_CHALLENGE);

describe('Auth0Client', () => {
  beforeEach(() => {
    mockWindow.crypto = {
      subtle: {
        digest: () => 'foo',
      },
      getRandomValues() {
        return '123';
      },
    };
  });

  afterEach(async () => {
    await browser.storage.local.clear();
    mockFetch.mockReset();
    jest.clearAllMocks();
  });

  describe('getTokenSilently', () => {
    it('uses the cache when expires_in > constant leeway', async () => {
      const auth0 = setup();
      const login = loginWithNewTabFn({}, mockFetch);

      await login(auth0, undefined, {
        token: {
          response: { expires_in: 70 },
        },
      });

      mockFetch.mockReset();

      const token = await auth0.getTokenSilently();

      expect(token).toBe(TEST_ACCESS_TOKEN);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
