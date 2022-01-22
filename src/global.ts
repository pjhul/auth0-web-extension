/** If you need to send custom parameters to the Authorization Server, make sure to use the original parameter name.  */

/**
 * @ignore
 */
export interface BaseLoginOptions {
  /**
   * - `'page'`: displays the UI with a full page view
   * - `'popup'`: displays the UI with a popup window
   * - `'touch'`: displays the UI in a way that leverages a touch interface
   * - `'wap'`: displays the UI with a "feature phone" type interface
   */
  display?: 'page' | 'popup' | 'touch' | 'wap';

  /**
   * - `'none'`: do not prompt user for login or consent on reauthentication
   * - `'login'`: prompt user for reauthentication
   * - `'consent'`: prompt user for consent before processing request
   * - `'select_account'`: prompt user to select an account
   */
  prompt?: 'none' | 'login' | 'consent' | 'select_account';

  /**
   * Maximum allowable elasped time (in seconds) since authentication.
   * If the last time the user authenticated is greater than this value,
   * the user must be reauthenticated.
   */
  max_age?: string | number;

  /**
   * The space-separated list of language tags, ordered by preference.
   * For example: `'fr-CA fr en'`.
   */
  ui_locales?: string;

  /**
   * Previously issued ID Token.
   */
  id_token_hint?: string;

  /**
   * Provides a hint to Auth0 as to what flow should be displayed.
   * The default behavior is to show a login page but you can override
   * this by passing 'signup' to show the signup page instead.
   *
   * This only affects the New Universal Login Experience.
   */
  screen_hint?: string;

  /**
   * The user's email address or other identifier. When your app knows
   * which user is trying to authenticate, you can provide this parameter
   * to pre-fill the email box or select the right session for sign-in.
   *
   * This currently only affects the classic Lock experience.
   */
  login_hint?: string;

  acr_values?: string;

  /**
   * The default scope to be used on authentication requests.
   * The defaultScope defined in the Auth0Client is included
   * along with this scope
   */
  scope?: string;

  /**
   * The default audience to be used for requesting API access.
   */
  audience?: string;

  /**
   * The name of the connection configured for your application.
   * If null, it will redirect to the Auth0 Login Page and show
   * the Login Widget.
   */
  connection?: string;

  /**
   * The Id of an organization to log in to.
   *
   * This will specify an `organization` parameter in your user's login request and will add a step to validate
   * the `org_id` claim in your user's ID Token.
   */
  organization?: string;

  /**
   * The Id of an invitation to accept. This is available from the user invitation URL that is given when participating in a user invitation flow.
   */
  invitation?: string;

  /**
   * If you need to send custom parameters to the Authorization Server,
   * make sure to use the original parameter name.
   */
  [key: string]: any;
}

interface AdvancedOptions {
  /**
   * The default scope to be included with all requests.
   * If not provided, 'openid profile email' is used. This can be set to `null` in order to effectively remove the default scopes.
   *
   * Note: The `openid` scope is **always applied** regardless of this setting.
   */
  defaultScope?: string;
}

export interface Auth0ClientOptions extends BaseLoginOptions {
  /**
   * Your Auth0 account domain such as `'example.auth0.com'`,
   * `'example.eu.auth0.com'` or , `'example.mycompany.com'`
   * (when using [custom domains](https://auth0.com/docs/custom-domains))
   */
  domain: string;
  /**
   * The issuer to be used for validation of JWTs, optionally defaults to the domain above
   */
  issuer?: string;
  /**
   * The Client ID found on your Application settings page
   */
  client_id: string;
  /**
   * The default URL where Auth0 will redirect your browser to with
   * the authentication result. It must be whitelisted in
   * the "Allowed Callback URLs" field in your Auth0 Application's
   * settings. If not provided here, it should be provided in the other
   * methods that provide authentication.
   */
  redirect_uri?: string;
  /**
   * The value in seconds used to account for clock skew in JWT expirations.
   * Typically, this value is no more than a minute or two at maximum.
   * Defaults to 60s.
   */
  leeway?: number;


  /**
   *
   * The location to use when storing cache data. Valid values are `memory` or `localstorage`.
   * The default setting is `memory`.
   *
   * Read more about [changing storage options in the Auth0 docs](https://auth0.com/docs/libraries/auth0-single-page-app-sdk#change-storage-options)
   */

  /** NOTE: We do not support a cache location other than memory right now */
  cacheLocation?: unknown; /* CacheLocation */

  /**
   * Specify a custom cache implementation to use for token storage and retrieval. This setting takes precedence over `cacheLocation` if they are both specified.
   */

  /** NOTE: We do not support custom cache implementations right now */
  cache?: unknown; /* ICache */

  /**
   * If true, refresh tokens are used to fetch new access tokens from the Auth0 server. If false, the legacy technique of using a hidden iframe and the `authorization_code` grant with `prompt=none` is used.
   * The default setting is `false`.
   *
   * **Note**: Use of refresh tokens must be enabled by an administrator on your Auth0 client application.
   */

  /** TODO: Add support for refresh tokens */
  useRefreshTokens?: boolean;

  /**
   * A maximum number of seconds to wait before declaring background calls to /authorize as failed for timeout
   * Defaults to 60s.
   */
  authorizeTimeoutInSeconds?: number;

  /**
   * Internal property to send information about the client to the authorization server.
   * @internal
   */
  auth0Client?: { name: string; version: string };

  /**
   * Sets an additional cookie with no SameSite attribute to support legacy browsers
   * that are not compatible with the latest SameSite changes.
   * This will log a warning on modern browsers, you can disable the warning by setting
   * this to false but be aware that some older useragents will not work,
   * See https://www.chromium.org/updates/same-site/incompatible-clients
   * Defaults to true
   */
  legacySameSiteCookie?: boolean;

  /**
   * If `true`, the SDK will use a cookie when storing information about the auth transaction while
   * the user is going through the authentication flow on the authorization server.
   *
   * The default is `false`, in which case the SDK will use session storage.
   *
   * @notes
   *
   * You might want to enable this if you rely on your users being able to authenticate using flows that
   * may end up spanning across multiple tabs (e.g. magic links) or you cannot otherwise rely on session storage being available.
   */
  useCookiesForTransactions?: boolean;

  /**
   * Changes to recommended defaults, like defaultScope
   */
  advancedOptions?: AdvancedOptions;

  /**
   * Number of days until the cookie `auth0.is.authenticated` will expire
   * Defaults to 1.
   */
  sessionCheckExpiryDays?: number;

  /**
   * When true, data to the token endpoint is transmitted as x-www-form-urlencoded data instead of JSON. The default is false, but will default to true in a
   * future major version.
   *
   * **Note:** Setting this to `true` may affect you if you use Auth0 Rules and are sending custom, non-primative data. If you enable this, please verify that your Auth0 Rules
   * continue to work as intended.
   */
  useFormData?: boolean;

  /**
   * Modify the value used as the current time during the token validation.
   *
   * **Note**: Using this improperly can potentially compromise the token validation.
   */
  nowProvider?: () => Promise<number> | number;
}

/**
 * The possible locations where tokens can be stored
 */
export type CacheLocation = 'memory' | 'localstorage';
