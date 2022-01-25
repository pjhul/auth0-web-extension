import { Auth0ClientOptions } from "./global"
import Auth0Client from "./Auth0Client"

import "./global"

export * from "./global"

import { handleTokenRequest } from "./handler"

export default function createAuth0Client(options: Auth0ClientOptions) {
  const auth0 = new Auth0Client(options);

  /**
   * We do not call auth0.checkSession() here because checking for the session when the client is first created
   * is highly unreliable as often content scripts are unable to receive messages at this time. To compensate,
   * we instead just call checkSession before getUser and getIdTokenClaims which provides the same behaviour.
   */

  return auth0;
}

export {
  GenericError,
  AuthenticationError,
  TimeoutError,
  MfaRequiredError,
} from "./errors"

export { Auth0Client, handleTokenRequest }
