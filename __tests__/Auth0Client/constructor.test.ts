import 'fast-text-encoding';
import unfetch from 'unfetch';
import { verifyIdToken } from '../../src/jwt';
import { MessageChannel } from 'worker_threads';
import * as utils from '../../src/utils';
import * as scope from '../../src/scope';

// @ts-ignore

import { assertUrlEquals, loginWithRedirectFn, setupFn } from './helpers';

import { TEST_CLIENT_ID, TEST_CODE_CHALLENGE, TEST_DOMAIN } from '../constants';
import { ICache } from '../../src/cache';

jest.mock('unfetch');
jest.mock('../../src/jwt');

const mockWindow = <any>global;
const mockFetch = (mockWindow.fetch = <jest.Mock>unfetch);
const mockVerify = <jest.Mock>verifyIdToken;

const mockCache: ICache = {
  set: jest.fn().mockResolvedValue(null),
  get: jest.fn().mockResolvedValue(null),
  remove: jest.fn().mockResolvedValue(null),
};

jest
  .spyOn(utils, 'bufferToBase64UrlEncoded')
  .mockReturnValue(TEST_CODE_CHALLENGE);

const setup = setupFn(mockVerify);

describe('Auth0Client', () => {
  const oldWindowLocation = window.location;

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

    mockWindow.open = jest.fn();
    mockWindow.addEventListener = jest.fn();
    mockWindow.crypto = {
      subtle: {
        digest: () => 'foo',
      },
      getRandomValues() {
        return '123';
      },
    };
    mockWindow.MessageChannel = MessageChannel;
    mockWindow.Worker = {};
    jest.spyOn(scope, 'getUniqueScopes');
    sessionStorage.clear();
  });

  afterEach(() => {
    mockFetch.mockReset();
    jest.clearAllMocks();
    window.location = oldWindowLocation;
  });

  describe('constructor', () => {
    it('ensures the openid scope is defined when customizing default scopes', () => {
      const auth0 = setup({
        advancedOptions: {
          defaultScope: 'test-scope',
        },
      });

      expect((<any>auth0).defaultScope).toBe('openid test-scope');
    });

    it('allows an empty custom default scope', () => {
      const auth0 = setup({
        advancedOptions: {
          defaultScope: null,
        },
      });

      expect((<any>auth0).defaultScope).toBe('openid');
    });

    it('should create issuer from domain', () => {
      const auth0 = setup({
        domain: 'test.dev',
      });

      expect((<any>auth0).tokenIssuer).toEqual('https://test.dev/');
    });

    it('should allow issuer as a domain', () => {
      const auth0 = setup({
        issuer: 'foo.bar.com',
      });

      expect((<any>auth0).tokenIssuer).toEqual('https://foo.bar.com/');
    });

    it('should allow issuer as a fully qualified url', () => {
      const auth0 = setup({
        issuer: 'https://some.issuer.com/',
      });

      expect((<any>auth0).tokenIssuer).toEqual('https://some.issuer.com/');
    });

    it('should allow specifying domain with http scheme', () => {
      const auth0 = setup({
        domain: 'http://localhost',
      });

      expect((<any>auth0).domainUrl).toEqual('http://localhost');
    });

    it('should allow specifying domain with https scheme', () => {
      const auth0 = setup({
        domain: 'https://localhost',
      });

      expect((<any>auth0).domainUrl).toEqual('https://localhost');
    });
  });
});
