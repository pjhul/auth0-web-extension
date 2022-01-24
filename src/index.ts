import { handleTokenRequest } from "./handler"

import { Auth0ClientOptions } from "./global"
import Auth0Client from "./Auth0Client"

import "./global"

export * from "./global"

/**
 * Asynchronously creates the Auth0Client instance and calls `checkSession`.
 *
 * **Note:** There are caveats to using this in a private browser tab, which may not silently authenticae
 * a user on page refresh. Please see [the checkSession docs](https://auth0.github.io/auth0-spa-js/classes/auth
 *
 * @param options The client options
 * @returns An instance of Auth0Client
 */
export default async function createAuth0Client(options: Auth0ClientOptions) {
  const auth0 = new Auth0Client(options);
  await auth0.checkSession();
  return auth0;
}

export { Auth0Client, handleTokenRequest }

export {
  GenericError,
  AuthenticationError,
  TimeoutError,
  MfaRequiredError,
} from "./errors";

export type { ICache, InMemoryCache, Cacheable, } from "./cache";
