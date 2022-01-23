import { Auth0ClientOptions, CacheLocation, GetTokenSilentlyOptions, GetTokenSilentlyVerboseResult } from "./global";
/**
 * Auth0 SDK for Background Scripts in a Web Extension
 */
export default class Auth0Client {
    private options;
    private cacheManager;
    private customOptions;
    private domainUrl;
    private tokenIssuer;
    private defaultScope;
    private scope;
    private nowProvider;
    cacheLocation: CacheLocation | null;
    constructor(options: Auth0ClientOptions);
    private _url;
    private _getParams;
    private _authorizeUrl;
    getTokenSilently(options: GetTokenSilentlyOptions & {
        detailedResponse: true;
    }): Promise<GetTokenSilentlyVerboseResult>;
    getTokenSilently(options?: GetTokenSilentlyOptions): Promise<string>;
    private _getTokenSilently;
    private _getTokenUsingRefreshToken;
    private _getTokenFromIfFrame;
    private _verifyIdToken;
    private _getEntryFromCache;
}
