import browser from 'webextension-polyfill';

import Lock from './lock';

import {
  bufferToBase64UrlEncoded,
  createSecureRandomString,
  createQueryParams,
  encode,
  sha256,
  validateCrypto,
} from './utils';

import Messenger from './messenger';
import TransactionManager from './transaction-manager';
import { oauthToken } from './api';
import { verifyIdToken } from './jwt';
import { getUniqueScopes } from './scope';

import { InMemoryStorage } from './storage';

import {
  InMemoryCache,
  ICache,
  CacheKeyManifest,
  CacheManager,
  CacheKey,
} from './cache';

import {
  DEFAULT_SCOPE,
  DEFAULT_NOW_PROVIDER,
  CACHE_LOCATION_MEMORY,
  RECOVERABLE_ERRORS,
} from './constants';

import {
  BaseLoginOptions,
  Auth0ClientOptions,
  CacheLocation,
  AuthorizeOptions,
  GetTokenSilentlyOptions,
  GetTokenSilentlyResult,
  AuthenticationResult,
  GetEntryFromCacheOptions,
  GetTokenSilentlyVerboseResult,
  User,
  GetUserOptions,
  IdToken,
  GetIdTokenClaimsOptions,
  RedirectLoginOptions,
  PopupLoginOptions,
  PopupConfigOptions,
} from './global';

import { AuthenticationError, TimeoutError } from './errors';

import {
  singlePromise,
  retryPromise,
  retryPromiseOnReject,
  delay,
} from './promise-utils';

const lock = new Lock();

const GET_TOKEN_SILENTLY_LOCK_KEY = 'auth0.lock.getTokenSilently';

/**
 * Auth0 SDK for Background Scripts in a Web Extension
 */
export default class Auth0Client {
  private transactionManager: TransactionManager;
  private messenger: Messenger;
  private cacheManager: CacheManager;
  private customOptions: BaseLoginOptions;
  private domainUrl: string;
  private tokenIssuer: string;
  private defaultScope: string;
  private scope: string | undefined;
  private nowProvider: () => number | Promise<number>;

  cacheLocation: CacheLocation;

  constructor(private options: Auth0ClientOptions) {
    validateCrypto();

    // TODO: find a way to validate we are running in a background script

    if (options.cache && options.cacheLocation) {
      console.warn(
        'Both `cache` and `cacheLocation` options have been specified in the Auth0Client configuration; ignoring `cacheLocation` and using `cache`.'
      );
    }

    let cache: ICache;

    if (options.cache) {
      cache = options.cache;

      this.cacheLocation = CACHE_LOCATION_MEMORY;
    } else {
      this.cacheLocation = options.cacheLocation || CACHE_LOCATION_MEMORY;

      const factory = cacheFactory(this.cacheLocation);

      if (!factory) {
        throw new Error(`Invalid cache location "${this.cacheLocation}"`);
      }

      cache = factory();
    }

    const transactionStorage = new InMemoryStorage();

    this.transactionManager = new TransactionManager(
      transactionStorage,
      this.options.client_id
    );

    this.messenger = new Messenger();

    this.scope = this.options.scope;

    this.nowProvider = this.options.nowProvider || DEFAULT_NOW_PROVIDER;

    this.cacheManager = new CacheManager(
      cache,
      !cache.allKeys
        ? new CacheKeyManifest(cache, this.options.client_id)
        : null,
      this.nowProvider
    );

    this.domainUrl = getDomain(this.options.domain);
    this.tokenIssuer = getTokenIssuer(this.options.issuer, this.domainUrl);

    this.defaultScope = getUniqueScopes(
      'openid',
      this.options?.advancedOptions?.defaultScope !== undefined
        ? this.options.advancedOptions.defaultScope
        : DEFAULT_SCOPE
    );

    if (this.options.useRefreshTokens) {
      // TODO: Add support for refresh tokens
    }

    this.customOptions = getCustomInitialOptions(options);

    this.messenger.addMessageListener((message, sender) => {
      switch (message.type) {
        case 'auth-result':
          if (sender.tab?.id) {
            this.messenger.sendTabMessage(sender.tab.id, {
              type: 'auth-cleanup',
            });
          }

          if (this.options.debug) {
            console.log(
              '[auth0-web-extension] Received authentication result back, cleaning up...'
            );
          }

          this._handleAuthorizeResponse(message.payload);
          break;

        case 'auth-error': {
          const transaction = this.transactionManager.get();

          if (transaction) {
            transaction.errorCallback(message.error);
          }

          if (sender.tab?.id) {
            this.messenger.sendTabMessage(sender.tab.id, {
              type: 'auth-cleanup',
            });
          }

          break;
        }

        case 'auth-params': {
          const transaction = this.transactionManager.get();

          if (this.options.debug) {
            console.log(
              '[auth0-web-extension] Sending authorize url to content script'
            );
          }

          if (transaction) {
            return {
              authorizeUrl: transaction.authorizeUrl,
              domainUrl: transaction.domainUrl,
            };
          }

          break;
        }

        default:
          throw new Error(`Invalid message type ${message.type}`);
      }
    });
  }

  private _url(path: string) {
    // TODO: Not sure if we should include the auth0Client param or not?
    return `${this.domainUrl}${path}`;
  }

  private _getParams(
    authorizeOptions: BaseLoginOptions,
    state: string,
    nonce: string,
    code_challenge: string,
    redirect_uri: string | undefined
  ): AuthorizeOptions {
    // These options should be excluded from the authorize URL,
    // as they"re options for the client and not for the IdP.
    // ** IMPORTANT ** If adding a new client option, include it in this destructure list.
    const {
      useRefreshTokens,
      useCookiesForTransactions,
      useFormData,
      auth0Client,
      cacheLocation,
      advancedOptions,
      detailedResponse,
      nowProvider,
      authorizeTimeoutInSeconds,
      legacySameSiteCookie,
      sessionCheckExpiryDays,
      domain,
      leeway,
      ...loginOptions
    } = this.options;

    return {
      ...loginOptions,
      ...authorizeOptions,
      scope: getUniqueScopes(
        this.defaultScope,
        this.scope,
        authorizeOptions.scope
      ),
      response_type: 'code',
      response_mode: 'query',
      state,
      nonce,
      redirect_uri: redirect_uri || this.options.redirect_uri,
      code_challenge,
      code_challenge_method: 'S256',
    };
  }

  private _authorizeUrl(authorizeOptions: AuthorizeOptions) {
    return this._url(`/authorize?${createQueryParams(authorizeOptions)}`);
  }

  /**
   * ```js
   * const user = await auth0.getUser();
   * ```
   *
   * Returns the user information if available (decoded from the `id_token`).
   *
   * If you provide an audience or scope, they should match an existing Access Token
   * (the SDK stores a corresponding ID Token with every Access Token, and uses the
   * scope and audience to look up the ID Token)
   *
   * @typeparam TUser The type to return, has to extend {@link User}.
   * @param options
   */
  public async getUser<TUser extends User>(
    options: GetUserOptions = {}
  ): Promise<TUser | undefined> {
    if (this.options.debug) console.log('[auth0-web-extension] - getUser');

    const audience = options.audience || this.options.audience || 'default';
    const scope = getUniqueScopes(this.defaultScope, this.scope, options.scope);
    const timeoutInSeconds =
      options.timeoutInSeconds || this.options.authorizeTimeoutInSeconds || 60;

    if (this.options.debug)
      console.log('[auth0-web-extension] - checking session');

    await this.checkSession({
      audience,
      scope,
      timeoutInSeconds,
    });

    if (this.options.debug)
      console.log('[auth0-web-extension] - looking for cached auth token');

    const cache = await this.cacheManager.get(
      new CacheKey({
        client_id: this.options.client_id,
        audience,
        scope,
      })
    );

    return cache?.decodedToken?.user as TUser | undefined;
  }

  /**
   * ```js
   * const claims = await auth0.getIdTokenClaims();
   * ```
   *
    Returns all claims from the id_token if available.
   *
   * If you provide an audience or scope, they should match an existin
   * (the SDK stores a corresponding ID Token with every Access Token,
   * scope and audience to look up the ID Token)
   *
   * @param options
   */
  public async getIdTokenClaims(
    options: GetIdTokenClaimsOptions = {}
  ): Promise<IdToken | undefined> {
    const audience = options.audience || this.options.audience || 'default';
    const scope = getUniqueScopes(this.defaultScope, this.scope, options.scope);

    if (this.options.debug)
      console.log('[auth0-web-extension] - checking session');

    await this.checkSession({
      audience,
      scope,
    });

    if (this.options.debug)
      console.log('[auth0-web-extension] - looking for cached auth token');

    const cache = await this.cacheManager.get(
      new CacheKey({
        client_id: this.options.client_id,
        audience,
        scope,
      })
    );

    return cache?.decodedToken?.claims;
  }

  public async loginWithNewTab<TAppState = any>(
    options: RedirectLoginOptions<TAppState> = {}
  ) {
    const { redirect_uri, appState, ...authorizeOptions } = options;

    const stateIn = encode(createSecureRandomString());
    const nonceIn = encode(createSecureRandomString());
    const codeVerifier = createSecureRandomString();
    const codeChallengeBuffer = await sha256(codeVerifier);
    const codeChallenge = bufferToBase64UrlEncoded(codeChallengeBuffer);
    const fragment = options.fragment ? `#${options.fragment}` : '';

    const params = this._getParams(
      authorizeOptions,
      stateIn,
      nonceIn,
      codeChallenge,
      redirect_uri
    );

    const url = this._authorizeUrl(params);
    const authorizeUrl = url + fragment;

    if (
      await retryPromise(
        () => lock.acquireLock(GET_TOKEN_SILENTLY_LOCK_KEY, 5000),
        10
      )
    ) {
      try {
        const result = await new Promise<GetTokenSilentlyResult>(
          async (resolve, reject) => {
            this.transactionManager.create({
              authorizeUrl,
              domainUrl: this.domainUrl,
              nonce: nonceIn,
              code_verifier: codeVerifier,
              appState,
              scope: params.scope,
              audience: params.audience || 'default',
              redirect_uri: params.redirect_uri,
              state: stateIn,
              callback: resolve,
              errorCallback: reject,
            });

            await browser.tabs.create({ url });
          }
        );

        return result;
      } finally {
        await lock.releaseLock(GET_TOKEN_SILENTLY_LOCK_KEY);

        if (this.options.debug)
          console.log('[auth0-web-extension] - lock released');
      }
    } else {
      throw new TimeoutError();
    }
  }

  public async loginWithPopup(
    options?: PopupLoginOptions,
    config?: PopupConfigOptions
  ) {
    options = options || {};
    config = config || {};

    const { ...authorizeOptions } = options;
    const stateIn = encode(createSecureRandomString());
    const nonceIn = encode(createSecureRandomString());
    const codeVerifier = createSecureRandomString();
    const codeChallengeBuffer = await sha256(codeVerifier);
    const codeChallenge = bufferToBase64UrlEncoded(codeChallengeBuffer);

    const params = this._getParams(
      authorizeOptions,
      stateIn,
      nonceIn,
      codeChallenge,
      this.options.redirect_uri
    );

    const url = this._authorizeUrl({
      ...params,
      response_mode: 'query',
    });

    const width = 400;
    const height = 600;

    if (
      await retryPromise(
        () => lock.acquireLock(GET_TOKEN_SILENTLY_LOCK_KEY, 5000),
        10
      )
    ) {
      try {
        return new Promise<GetTokenSilentlyResult>(async (resolve, reject) => {
          const popup = await browser.windows.create({
            width,
            height,
            type: 'popup',
            url,
          });

          const removeWindow =
            (func: (...args: any[]) => void) =>
            (...args: any[]) => {
              if (popup.id) {
                browser.windows.remove(popup.id);
              }

              func(args);
            };

          this.transactionManager.create({
            authorizeUrl: url,
            domainUrl: this.domainUrl,
            nonce: nonceIn,
            code_verifier: codeVerifier,
            scope: params.scope,
            audience: params.audience || 'default',
            redirect_uri: params.redirect_uri,
            state: stateIn,
            callback: removeWindow(resolve),
            errorCallback: removeWindow(reject),
          });
        });
      } finally {
        await lock.releaseLock(GET_TOKEN_SILENTLY_LOCK_KEY);

        if (this.options.debug)
          console.log('[auth0-web-extension] - lock released');
      }
    } else {
      throw new TimeoutError();
    }
  }

  private async _handleAuthorizeResponse(authResult: AuthenticationResult) {
    try {
      const { error = '', error_description = '', state, code } = authResult;

      const transaction = this.transactionManager.get();

      if (!transaction) {
        throw new Error('Invalid state');
      }

      if (this.options.debug) {
        console.log('[auth0-web-extension] Unregistering current transaction');
      }

      if (authResult.error) {
        throw new AuthenticationError(
          error,
          error_description,
          authResult.state,
          transaction.appState
        );
      }

      if (
        !transaction.code_verifier ||
        (transaction.state && transaction.state !== state)
      ) {
        throw new Error('Invalid state');
      }

      const tokenResult = await oauthToken({
        ...this.customOptions,
        audience: transaction.audience,
        scope: transaction.scope,
        redirect_uri: transaction.redirect_uri || this.options.redirect_uri,
        baseUrl: this.domainUrl,
        client_id: this.options.client_id,
        code_verifier: transaction.code_verifier,
        grant_type: 'authorization_code',
        code,
        useFormData: this.options.useFormData,
      });

      if (this.options.debug) {
        console.log(
          '[auth0-web-extension] Received token using code and verifier'
        );
      }

      const decodedToken = await this._verifyIdToken(
        tokenResult.id_token,
        transaction.nonce
      );

      await this.cacheManager.set({
        ...tokenResult,
        decodedToken,
        audience: transaction.audience,
        scope: transaction.scope,
        ...(tokenResult.scope ? { oauthTokenScope: tokenResult.scope } : null),
        client_id: this.options.client_id,
      });

      if (this.options.debug) {
        console.log('[auth0-web-extension] Stored token in cache');
      }

      transaction.callback({
        ...tokenResult,
        decodedToken,
        scope: transaction.scope,
        oauthTokenScope: transaction.scope,
        audience: transaction.audience,
      });

      return {
        appState: transaction.appState,
      };
    } catch (error) {
      const transaction = this.transactionManager.get();
      transaction?.errorCallback(error);
    } finally {
      this.transactionManager.remove();
    }
  }

  /**
   * ```js
   * const isAuthenticated = await auth0.isAuthenticated();
   * ```
   *
   * Returns `true` if there's valid information stored,
   * otherwise returns `false`.
   *
   */
  public async isAuthenticated() {
    if (this.options.debug)
      console.log('[auth0-web-extension] - isAuthenticated');

    const user = await this.getUser();
    return Boolean(user);
  }

  public async checkSession(options?: GetTokenSilentlyOptions) {
    // TODO: Check for cookie

    try {
      await this.getTokenSilently(options);
    } catch (error) {
      if (!RECOVERABLE_ERRORS.includes((error as any).error)) {
        throw error;
      }
    }
  }

  public async getTokenSilently(
    options: GetTokenSilentlyOptions & { detailedResponse: true }
  ): Promise<GetTokenSilentlyVerboseResult>;

  public async getTokenSilently(
    options?: GetTokenSilentlyOptions
  ): Promise<string>;

  /**
   * Fetches a new access token
   *
   * ```js
   * const token = await auth0.getTokenSilently(options);
   * ```
   *
   * Refresh tokens are currently not supported
   */
  public async getTokenSilently(
    options: GetTokenSilentlyOptions = {}
  ): Promise<string | GetTokenSilentlyVerboseResult> {
    return singlePromise(
      () =>
        this._getTokenSilently({
          audience: this.options.audience,
          ignoreCache: false,
          ...options,
          scope: getUniqueScopes(this.defaultScope, this.scope, options.scope),
        }),
      `${this.options.client_id}::${this.options.audience}::${getUniqueScopes(
        this.defaultScope,
        this.scope,
        options.scope
      )}`
    );
  }

  private async _getTokenSilently(
    options: GetTokenSilentlyOptions = {}
  ): Promise<string | GetTokenSilentlyVerboseResult> {
    if (this.options.debug)
      console.log('[auth0-web-extension] - getTokenSilently');

    const { ignoreCache, ...getTokenOptions } = options;

    if (!ignoreCache && getTokenOptions.scope) {
      const entry = await this._getEntryFromCache({
        scope: getTokenOptions.scope,
        audience: getTokenOptions.audience || 'default',
        client_id: this.options.client_id,
        getDetailedEntry: options.detailedResponse,
      });

      if (entry) {
        if (this.options.debug)
          console.log('[auth0-web-extension] - cache hit! returning token');

        return entry;
      }

      if (this.options.debug)
        console.log('[auth0-web-extension] - no cache hit, continuing');
    }

    if (this.options.debug)
      console.log('[auth0-web-extension] - waiting for lock');

    if (
      await retryPromise(
        () => lock.acquireLock(GET_TOKEN_SILENTLY_LOCK_KEY, 5000),
        10
      )
    ) {
      if (this.options.debug)
        console.log('[auth0-web-extension] - lock acquired!');

      try {
        if (!ignoreCache && getTokenOptions.scope) {
          const entry = await this._getEntryFromCache({
            scope: getTokenOptions.scope,
            audience: getTokenOptions.audience || 'default',
            client_id: this.options.client_id,
            getDetailedEntry: options.detailedResponse,
          });

          if (entry) {
            if (this.options.debug)
              console.log('[auth0-web-extension] - cache hit! returning token');

            return entry;
          }

          if (this.options.debug)
            console.log('[auth0-web-extension] - no hit, continuing');
        }

        const timeout =
          options.timeoutInSeconds ||
          this.options.authorizeTimeoutInSeconds ||
          60;

        const rejectOnTimeout = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new TimeoutError()), timeout * 1000);
        });

        const authResult = await Promise.race([
          this.options.useRefreshTokens
            ? await this._getTokenUsingRefreshToken(getTokenOptions)
            : await this._getTokenFromIFrame(getTokenOptions),
          rejectOnTimeout,
        ]);

        if (this.options.debug)
          console.log('[auth0-web-extension] - storing auth token in cache');

        // TODO: Save to cookies

        if (options.detailedResponse) {
          const { id_token, access_token, oauthTokenScope, expires_in } =
            authResult;

          return {
            id_token,
            access_token,
            ...(oauthTokenScope ? { scope: oauthTokenScope } : null),
            expires_in,
          };
        }

        return authResult.access_token;
      } finally {
        await lock.releaseLock(GET_TOKEN_SILENTLY_LOCK_KEY);

        if (this.options.debug)
          console.log('[auth0-web-extension] - lock released');
      }
    } else {
      throw new TimeoutError();
    }
  }

  private async _getTokenUsingRefreshToken(
    options: GetTokenSilentlyOptions
  ): Promise<GetTokenSilentlyResult> {
    throw "We currently don't support using refresh tokens, set useRefreshTokens to false";
  }

  private async _getTokenFromIFrame(
    options: GetTokenSilentlyOptions
  ): Promise<GetTokenSilentlyResult> {
    const stateIn = encode(createSecureRandomString());
    const nonceIn = encode(createSecureRandomString());
    const codeVerifier = createSecureRandomString();
    const codeChallengeBuffer = await sha256(codeVerifier);
    const codeChallenge = bufferToBase64UrlEncoded(codeChallengeBuffer);

    if (this.options.debug)
      console.log('[auth0-web-extension] - getTokenFromIFrame');

    const params = this._getParams(
      options,
      stateIn,
      nonceIn,
      codeChallenge,
      options.redirect_uri || this.options.redirect_uri
    );

    // TODO: Add support for organizations

    const url = this._authorizeUrl({
      ...params,
      prompt: 'none',
      response_mode: 'web_message',
    });

    if (this.options.debug)
      console.log('[auth0-web-extension] - built authorize url');

    try {
      if (this.options.debug)
        console.log(
          '[auth0-web-extension] - checking if current tab has content script running'
        );

      const tabId = await retryPromiseOnReject<number | null>(
        this._getTabId.bind(this),
        10
      );

      if (!tabId) {
        throw 'Failed to connect to tab too many times';
      }

      await this.messenger.sendTabMessage(tabId, {
        type: 'auth-start',
      });

      return new Promise<GetTokenSilentlyResult>((resolve, reject) => {
        this.transactionManager.create({
          authorizeUrl: url,
          domainUrl: this.domainUrl,
          nonce: nonceIn,
          code_verifier: codeVerifier,
          scope: params.scope,
          audience: params.audience || 'default',
          redirect_uri: params.redirect_uri,
          state: stateIn,
          callback: resolve,
          errorCallback: reject,
        });
      });
    } catch (e) {
      if ((e as any).error === 'login_required') {
        // TODO: Log user out
      }

      throw e;
    }
  }

  private async _getTabId(): Promise<number | null> {
    try {
      const queryOptions = { active: true, currentWindow: true };
      let [currentTab] = await browser.tabs.query(queryOptions);

      const { id } = currentTab || {};

      if (this.options.debug)
        console.log(`[auth0-web-extension] - current tab id ${id}`);

      if (id) {
        // This will throw if there is not a content script running
        const resp = await this.messenger.sendTabMessage(id, {
          type: 'auth-ack',
        });

        if (this.options.debug)
          console.log(
            `[auth0-web-extension] - received response from current tab`
          );

        if (resp === 'ack') {
          return id;
        } else {
          throw new Error('Received invalid response on acknowledgement');
        }
      }
    } catch (error) {
      if (this.options.debug) console.log(`[auth0-web-extension] - ${error}`);

      throw error;
    }

    throw 'Could not access current tab.';
  }

  private async _verifyIdToken(
    id_token: string,
    nonce?: string,
    organizationId?: string
  ) {
    const now = await this.nowProvider();

    return verifyIdToken({
      iss: this.tokenIssuer,
      aud: this.options.client_id,
      id_token,
      nonce,
      organizationId,
      leeway: this.options.leeway,
      max_age: parseNumber(this.options.max_age),
      now,
    });
  }

  private async _getEntryFromCache({
    scope,
    audience,
    client_id,
    getDetailedEntry = false,
  }: GetEntryFromCacheOptions): Promise<
    string | GetTokenSilentlyVerboseResult | undefined
  > {
    const entry = await this.cacheManager.get(
      new CacheKey({
        scope,
        audience,
        client_id,
      }),
      60
    );

    if (entry && entry.access_token) {
      if (getDetailedEntry) {
        const { id_token, access_token, oauthTokenScope, expires_in } = entry;

        if (!id_token || !expires_in) {
          return undefined;
        }

        return {
          id_token,
          access_token,
          ...(oauthTokenScope ? { scope: oauthTokenScope } : null),
          expires_in,
        };
      } else {
        return entry.access_token;
      }
    }
  }
}

const parseNumber = (value: any): number | undefined => {
  if (typeof value !== 'string') {
    return value;
  } else {
    return parseInt(value, 10) || undefined;
  }
};

const getDomain = (domainUrl: string) => {
  if (!/^https?:\/\//.test(domainUrl)) {
    return `https://${domainUrl}`;
  } else {
    return domainUrl;
  }
};

const cacheLocationBuilders: Record<string, () => ICache> = {
  [CACHE_LOCATION_MEMORY]: () => new InMemoryCache().enclosedCache,
};

const cacheFactory = (location: string) => {
  return cacheLocationBuilders[location];
};

const getTokenIssuer = (issuer: string | undefined, domainUrl: string) => {
  if (issuer) {
    return issuer.startsWith('https://') ? issuer : `https://${issuer}/`;
  } else {
    return `${domainUrl}/`;
  }
};

const getCustomInitialOptions = (
  options: Auth0ClientOptions
): BaseLoginOptions => {
  const {
    advancedOptions,
    audience,
    auth0Client,
    authorizeTimeoutInSeconds,
    cacheLocation,
    client_id,
    domain,
    issuer,
    leeway,
    max_age,
    redirect_uri,
    scope,
    useRefreshTokens,
    useCookiesForTransactions,
    useFormData,
    ...customParams
  } = options;
  return customParams;
};
