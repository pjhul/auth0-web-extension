import { TokenEndpointOptions, TokenEndpointResponse } from './global';
export declare function oauthToken({ baseUrl, timeout, audience, scope, useFormData, ...options }: TokenEndpointOptions): Promise<TokenEndpointResponse>;
