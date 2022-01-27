import { TokenEndpointOptions, TokenEndpointResponse } from './global'
import { fetchJSON } from './http'
import { createQueryParams } from './utils'

export async function oauthToken(
  {
    baseUrl,
    timeout,
    audience,
    scope,
    useFormData,
    ...options
  }: TokenEndpointOptions,
) {
  const body = useFormData
    ? createQueryParams(options)
    : JSON.stringify(options);

  return await fetchJSON<TokenEndpointResponse>(
    `${baseUrl}/oauth/token`,
    {
      method: 'POST',
      body,
      headers: {
        'Content-Type': useFormData
          ? 'application/x-www-form-urlencoded'
          : 'application/json',
      }
    },
    timeout,
  );
}
