import { Auth0ClientOptions, CacheLocation, GetTokenSilentlyOptions, GetTokenSilentlyResult, GetTokenSilentlyVerboseResult, User, GetUserOptions, IdToken, GetIdTokenClaimsOptions, RedirectLoginOptions } from './global';
/**
 * Auth0 SDK for Background Scripts in a Web Extension
 */
export default class Auth0Client {
    private options;
    private transactionManager;
    private messenger;
    private cacheManager;
    private customOptions;
    private domainUrl;
    private tokenIssuer;
    private defaultScope;
    private scope;
    private nowProvider;
    cacheLocation: CacheLocation;
    constructor(options: Auth0ClientOptions);
    private _url;
    private _getParams;
    private _authorizeUrl;
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
    getUser<TUser extends User>(options?: GetUserOptions): Promise<TUser | undefined>;
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
    getIdTokenClaims(options?: GetIdTokenClaimsOptions): Promise<IdToken | undefined>;
    loginWithNewTab<TAppState = any>(options?: RedirectLoginOptions<TAppState>): Promise<GetTokenSilentlyResult>;
    private _handleAuthorizeResponse;
    /**
     * ```js
     * const isAuthenticated = await auth0.isAuthenticated();
     * ```
     *
     * Returns `true` if there's valid information stored,
     * otherwise returns `false`.
     *
     */
    isAuthenticated(): Promise<boolean>;
    checkSession(options?: GetTokenSilentlyOptions): Promise<void>;
    getTokenSilently(options: GetTokenSilentlyOptions & {
        detailedResponse: true;
    }): Promise<GetTokenSilentlyVerboseResult>;
    getTokenSilently(options?: GetTokenSilentlyOptions): Promise<string>;
    private _getTokenSilently;
    private _getTokenUsingRefreshToken;
    private _getTokenFromIFrame;
    private _getTabId;
    private _verifyIdToken;
    private _getEntryFromCache;
}
