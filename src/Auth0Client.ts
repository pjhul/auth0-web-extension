import browser from "webextension-polyfill"

import {
  bufferToBase64UrlEncoded,
  createRandomString,
  createQueryParams,
  encode,
  sha256,
} from "./utils"

import { oauthToken } from "./api"

import { verifyIdToken } from "./jwt"

import {
  DEFAULT_SCOPE,
  DEFAULT_NOW_PROVIDER,
} from "./constants"

import {
  BaseLoginOptions,
  Auth0ClientOptions,
  AuthorizeOptions,
  GetTokenSilentlyOptions,
  GetTokenSilentlyResult,
  OAuthTokenOptions,
  AuthenticationResult,
} from "./global"

/**
 * Auth0 SDK for Background Scripts in a Web Extension
 */
export default class Auth0Client {
  private customOptions: BaseLoginOptions
  private domainUrl: string
  private tokenIssuer: string
  private defaultScope: string
  private scope: string | undefined
  private nowProvider: () => number | Promise<number>

  constructor(private options: Auth0ClientOptions) {
    // TODO: validate crypto library

    this.scope = this.options.scope;

    this.nowProvider = this.options.nowProvider || DEFAULT_NOW_PROVIDER;

    this.domainUrl = getDomain(this.options.domain);
    this.tokenIssuer = getTokenIssuer(this.options.issuer, this.domainUrl);

    this.defaultScope = getUniqueScopes(
      "openid",
      this.options?.advancedOptions?.defaultScope || DEFAULT_SCOPE,
    );

    if(this.options.useRefreshTokens) {
      // TODO: Add support for refresh tokens
    }

    this.customOptions = getCustomInitialOptions(options);
  }

  private _url(path: string) {
    // TODO: Not sure if we should include the auth0Client param or not?
    return `${this.domainUrl}${path}`
  }

  private _getParams(
    authorizeOptions: BaseLoginOptions,
    state: string,
    nonce: string,
    code_challenge: string,
    redirect_uri: string | undefined,
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
      response_type: "code",
      response_mode: "query",
      state,
      nonce,
      redirect_uri: redirect_uri || this.options.redirect_uri,
      code_challenge,
      code_challenge_method: "S256"
    };
  }

  private _authorizeUrl(authorizeOptions: AuthorizeOptions) {
    return this._url(`/authorize?${createQueryParams(authorizeOptions)}`);
  }

  // TODO: Return verbose response if detailedResponse = true

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
    options: GetTokenSilentlyOptions = {},
  ): Promise<string> {
    // FIXME: Should use keyed singlePromise like is auth0-spa-js
    return this._getTokenSilently({
      audience: this.options.audience,
      // TODO: Support caching and change this to default false
      ignoreCache: true,
      ...options,
      scope: getUniqueScopes(this.defaultScope, this.scope, options.scope),
    });
  }

  private async _getTokenSilently(
    options: GetTokenSilentlyOptions = {},
  ): Promise<string> {
    const { ignoreCache, ...getTokenOptions } = options;

    if(!ignoreCache) {
      // TODO: Support caching
      throw "We currently do not support caching, set the ignoreCache option to true";
    }

    // TODO: Acquire lock

    const authResult = this.options.useRefreshTokens
      ? await this._getTokenUsingRefreshToken(getTokenOptions)
      : await this._getTokenFromIfFrame(getTokenOptions);

    // TODO: Save to cache and cookies

    return authResult.access_token;
  }

  private async _getTokenUsingRefreshToken(
    options: GetTokenSilentlyOptions,
  ): Promise<GetTokenSilentlyResult> {
    throw "We currently don't support using refresh tokens, set useRefreshTokens to false";
  }

  private async _getTokenFromIfFrame(
    options: GetTokenSilentlyOptions,
  ): Promise<GetTokenSilentlyResult> {
    const stateIn = encode(createRandomString());
    const nonceIn = encode(createRandomString());
    const code_verifier = createRandomString();
    const code_challengeBuffer = await sha256(code_verifier);
    const code_challenge = bufferToBase64UrlEncoded(code_challengeBuffer);

    const params = this._getParams(
      options,
      stateIn,
      nonceIn,
      code_challenge,
      options.redirect_uri ||
        this.options.redirect_uri,
    );

    // TODO: Add support for organizations

    const url = this._authorizeUrl({
      ...params,
      prompt: "none",
      response_mode: "web_message",
    })

    const timeout =
      options.timeoutInSeconds || this.options.authorizeTimeoutInSeconds;

    try {
      const queryOptions = { active: true, currentWindow: true };
      let [currentTab] = await browser.tabs.query(queryOptions);

      if(!currentTab?.id) {
        throw "Could not access current tab. Do you have the 'activeTab' permission in your manifest?";
      }

      await browser.scripting.executeScript({
        target: { tabId: currentTab.id, },
        func: (url: string) => {
          const iframe = document.createElement("iframe");

          iframe.setAttribute("width", "0");
          iframe.setAttribute("height", "0");
          iframe.style.display = "none";

          document.body.appendChild(iframe)
          iframe.setAttribute("src", url)
        },
        args: [params.redirect_uri],
      });

      const codeResult: AuthenticationResult = await new Promise((resolve) => {
        browser.runtime.onConnect.addListener((port) => {
          port.onMessage.addListener((message, port) => {
            // TODO: Verify sender
            if(message === "auth_params") {
              port.postMessage({
                authorizeUrl: url,
                domainUrl: this.domainUrl,
              });
            } else {
              resolve(message);
              port.disconnect();
            }
          })
        })
      });

      if(stateIn !== codeResult.state) {
        throw new Error("Invalid state");
      }

      const {
        scope,
        audience,
        redirect_uri,
        ignoreCache,
        timeoutInSeconds,
        detailedResponse,
        ...customOptions
      } = options;

      const tokenResult = await oauthToken({
        ...this.customOptions,
        ...customOptions,
        scope,
        audience,
        baseUrl: this.domainUrl,
        client_id: this.options.client_id,
        code_verifier,
        code: codeResult.code,
        grant_type: "authorization_code",
        redirect_uri: params.redirect_uri,
        useFormData: this.options.useFormData,
        auth0Client: {},
      });

      const decodedToken = await this._verifyIdToken(
        tokenResult.id_token,
        nonceIn,
      );

      return {
        ...tokenResult,
        decodedToken,
        scope: params.scope,
        oauthTokenScope: tokenResult.scope as string,
        audience: params.audience || "default",
      };
    } catch(e) {
      if((e as any).error === "login_required") {
        // TODO: Log user out
      }

      throw e;
    }
  }

  private async _verifyIdToken(
    id_token: string,
    nonce?: string,
    organizationId?: string,
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
}

const parseNumber = (value: any): number | undefined => {
  if(typeof value !== "string") {
    return value;
  } else {
    return parseInt(value, 10) || undefined
  }
}

const getDomain = (domainUrl: string) => {
  if(!/^https?:\/\//.test(domainUrl)) {
    return `https://${domainUrl}`;
  } else {
    return domainUrl;
  }
}

const getTokenIssuer = (issuer: string | undefined, domainUrl: string) => {
  if(issuer) {
    return issuer.startsWith("https://") ? issuer : `https://${issuer}/`;
  } else {
    return `${domainUrl}/`;
  }
}

const dedupe = (arr: string[]) => Array.from(new Set(arr));

const getUniqueScopes = (...scopes: (string | undefined)[]) => {
  return dedupe(scopes.filter(Boolean).join(" ").trim().split(/\s+/)).join(" ")
}

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
