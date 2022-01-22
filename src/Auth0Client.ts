import {
  DEFAULT_SCOPE,
  DEFAULT_NOW_PROVIDER,
} from "./constants"

import {
  Auth0ClientOptions
} from "./global"

/**
 * Auth0 SDK for Background Scripts in a Web Extension
 */
export default class Auth0Client {
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
    )

    if(this.options.useRefreshTokens) {
      // TODO: Add support for refresh tokens
    }
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

const getUniqueScopes = (...scopes: string[]) => {
  return dedupe(scopes.join(" ").trim().split(/\s+/)).join(" ")
}
