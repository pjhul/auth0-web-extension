import "fast-text-encoding";
import { Auth0ClientOptions } from "./global";
import Auth0Client from "./Auth0Client";
import "./global";
export * from "./global";
import { handleTokenRequest } from "./handler";
export default function createAuth0Client(options: Auth0ClientOptions): Auth0Client;
export { GenericError, AuthenticationError, TimeoutError, MfaRequiredError, } from "./errors";
export { Auth0Client, handleTokenRequest };
