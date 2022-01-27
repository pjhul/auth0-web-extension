import {
  Auth0ClientOptions,
  AuthenticationResult,
  GetTokenSilentlyOptions,
  IdToken,
} from '../../src';

import Auth0Client from '../../src/Auth0Client';

import {
  TEST_ACCESS_TOKEN,
  TEST_CLIENT_ID,
  TEST_CODE,
  TEST_DOMAIN,
  TEST_ID_TOKEN,
  TEST_REDIRECT_URI,
  TEST_REFRESH_TOKEN,
  TEST_STATE,
} from '../constants';

const authorizationResponse: AuthenticationResult = {
  code: 'my_code',
  state: TEST_STATE,
};

/**
 * Extracts the keys and values from an IterableIterator and applies
 * them to an object.
 * @param itor The iterable
 * @returns An object with the keys and values from the iterable
 */
const itorToObject = <K extends string | number | symbol, V>(
  itor: IterableIterator<[K, V]>
): Record<K, V> =>
  [...itor].reduce((m, [key, value]) => {
    m[key] = value;
    return m;
  }, {} as Record<K, V>);

/**
 * Asserts that the supplied URL matches various criteria, including host, path, and query params.
 * @param actualUrl The URL
 * @param host The host
 * @param path The URL path
 * @param queryParams The query parameters to check
 * @param strict If true, the query parameters must match the URL parameters exactly. Otherwise, a loose match is performed to check that
 * the parameters passed in at least appear in the URL (but the URL can have extra ones). Default is true.
 */
export const assertUrlEquals = (
  actualUrl: URL | string,
  host: string,
  path: string,
  queryParams: Record<string, string>,
  strict: boolean = true
) => {
  const url = new URL(actualUrl);
  const searchParamsObj = itorToObject((url.searchParams as any).entries());

  expect(url.host).toEqual(host);
  expect(url.pathname).toEqual(path);

  if (strict) {
    expect(searchParamsObj).toStrictEqual({
      auth0Client: expect.any(String),
      ...queryParams,
    });
  } else {
    expect(searchParamsObj).toMatchObject(queryParams);
  }
};

export const fetchResponse = (ok, json) =>
  Promise.resolve({
    ok,
    json: () => Promise.resolve(json),
  });

export const setupFn = (mockVerify: jest.Mock) => {
  return (config?: Partial<Auth0ClientOptions>, claims?: Partial<IdToken>) => {
    const auth0 = new Auth0Client(
      Object.assign(
        {
          domain: TEST_DOMAIN,
          client_id: TEST_CLIENT_ID,
          redirect_uri: TEST_REDIRECT_URI,
        },
        config
      )
    );

    mockVerify.mockReturnValue({
      claims: Object.assign(
        {
          exp: Date.now() / 1000 + 86400,
        },
        claims
      ),
      user: {
        sub: 'me',
      },
    });

    return auth0;
  };
};

const processDefaultLoginWithRedirectOptions = config => {
  const defaultTokenResponseOptions = {
    success: true,
    response: {},
  };
  const defaultAuthorizeResponseOptions = {
    code: TEST_CODE,
    state: TEST_STATE,
  };
  const token = {
    ...defaultTokenResponseOptions,
    ...(config.token || {}),
  };
  const authorize = {
    ...defaultAuthorizeResponseOptions,
    ...(config.authorize || {}),
  };

  return {
    token,
    authorize,
    useHash: config.useHash,
    customCallbackUrl: config.customCallbackUrl,
  };
};

const processDefaultLoginWithPopupOptions = config => {
  const defaultTokenResponseOptions = {
    success: true,
    response: {},
  };

  const defaultAuthorizeResponseOptions = {
    response: authorizationResponse,
  };

  const token = {
    ...defaultTokenResponseOptions,
    ...(config.token || {}),
  };

  const authorize = {
    ...defaultAuthorizeResponseOptions,
    ...(config.authorize || {}),
  };

  const delay = config.delay || 0;

  return {
    token,
    authorize,
    delay,
  };
};

export const setupMessageEventLister = (
  mockWindow: any,
  response: any = {},
  delay = 0
) => {
  mockWindow.addEventListener.mockImplementationOnce((type, cb) => {
    if (type === 'message') {
      setTimeout(() => {
        cb({
          data: {
            type: 'authorization_response',
            response,
          },
        });
      }, delay);
    }
  });

  mockWindow.open.mockReturnValue({
    close: () => {},
    location: {
      href: '',
    },
  });
};

export const checkSessionFn = mockFetch => {
  return async auth0 => {
    mockFetch.mockResolvedValueOnce(
      fetchResponse(true, {
        id_token: TEST_ID_TOKEN,
        refresh_token: TEST_REFRESH_TOKEN,
        access_token: TEST_ACCESS_TOKEN,
        expires_in: 86400,
      })
    );
    await auth0.checkSession();
  };
};

const processDefaultGetTokenSilentlyOptions = config => {
  const defaultTokenResponseOptions = {
    success: true,
    response: {},
  };
  const token = {
    ...defaultTokenResponseOptions,
    ...(config.token || {}),
  };

  return {
    token,
  };
};

export const getTokenSilentlyFn = (mockWindow, mockFetch) => {
  return async (
    auth0,
    options: GetTokenSilentlyOptions = undefined,
    testConfig: {
      token?: {
        success?: boolean;
        response?: any;
      };
    } = {
      token: {},
    }
  ) => {
    const { token } = processDefaultGetTokenSilentlyOptions(testConfig);

    mockFetch.mockResolvedValueOnce(
      fetchResponse(
        token.success,
        Object.assign(
          {
            id_token: TEST_ID_TOKEN,
            refresh_token: TEST_REFRESH_TOKEN,
            access_token: TEST_ACCESS_TOKEN,
            expires_in: 86400,
          },
          token.response
        )
      )
    );

    return await auth0.getTokenSilently(options);
  };
};
