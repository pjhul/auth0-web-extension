import { Auth0ClientOptions } from "./global";
import Auth0Client from "./Auth0Client";
import { handleTokenRequest } from "./handler";
export default function createAuth0Client(options: Auth0ClientOptions): Auth0Client;
export { Auth0Client, handleTokenRequest };
