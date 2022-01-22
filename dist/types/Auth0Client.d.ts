import { Auth0ClientOptions, GetTokenSilentlyOptions } from "./global";
/**
 * Auth0 SDK for Background Scripts in a Web Extension
 */
export default class Auth0Client {
    private options;
    private customOptions;
    private domainUrl;
    private tokenIssuer;
    private defaultScope;
    private scope;
    private nowProvider;
    constructor(options: Auth0ClientOptions);
    private _url;
    private _getParams;
    private _authorizeUrl;
    /**
     * Fetches a new access token
     *
     * ```js
     * const token = await auth0.getTokenSilently(options);
     * ```
     *
     * Refresh tokens are currently not supported
     */
    getTokenSilently(options?: GetTokenSilentlyOptions): Promise<string>;
    private _getTokenSilently;
    private _getTokenUsingRefreshToken;
    private _getTokenFromIfFrame;
    private _verifyIdToken;
}
