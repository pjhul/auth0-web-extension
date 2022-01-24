import { Auth0ClientOptions } from "./global"
import Auth0Client from "./Auth0Client"

import "./global"

export * from "./global"

import { handleTokenRequest } from "./handler"

export default /* async */ function createAuth0Client(options: Auth0ClientOptions) {
  const auth0 = new Auth0Client(options);
  // TODO: run auth0.checkSession();
  return auth0;
}

export {
  GenericError,
  AuthenticationError,
  TimeoutError,
  MfaRequiredError,
} from "./errors"

export { Auth0Client, handleTokenRequest }
