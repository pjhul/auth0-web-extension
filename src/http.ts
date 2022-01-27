import fetch from 'unfetch';

import {
  DEFAULT_FETCH_TIMEOUT_MS,
  DEFAULT_SILENT_TOKEN_RETRY_COUNT,
} from './constants';

import { FetchOptions } from './global';
import { GenericError, MfaRequiredError } from './errors';

export const createAbortController = () => new AbortController();

const dofetch = async (fetchUrl: string, fetchOptions: FetchOptions) => {
  const response = await fetch(fetchUrl, fetchOptions);
  return {
    ok: response.ok,
    json: await response.json(),
  };
};

// Removed switch fetch as there's no need to fetch from a worker as we are already in a service worker

export const fetchWithTimeout = async (
  fetchUrl: string,
  fetchOptions: FetchOptions,
  timeout: number = DEFAULT_FETCH_TIMEOUT_MS
) => {
  const controller = createAbortController();
  fetchOptions.signal = controller.signal;

  let timeoutId: NodeJS.Timeout;

  // The promise will resolve with one of these two promises (the fetch or the timeout), whichever completes first.
  return Promise.race([
    dofetch(fetchUrl, fetchOptions),
    new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        controller.abort();
        reject(new Error("Timeout when executing 'fetch'"));
      }, timeout);
    }),
  ]).finally(() => {
    clearTimeout(timeoutId);
  });
};

export async function fetchJSON<T>(
  url: string,
  options: FetchOptions,
  timeout?: number
): Promise<T> {
  let fetchError: null | Error = null;
  let response: any;

  for (let i = 0; i < DEFAULT_SILENT_TOKEN_RETRY_COUNT; i++) {
    try {
      response = await fetchWithTimeout(url, options, timeout);
      fetchError = null;
      break;
    } catch (e) {
      // Fetch only fails in the case of a network issue, so should be
      // retried here. Failure status (4xx, 5xx, etc) return a resolved Promise
      // with the failure in the body.
      // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
      fetchError = e as Error | null;
    }
  }

  if (fetchError) {
    // unfetch uses XMLHttpRequest under the hood which throws
    // ProgressEvents on error, which don't have message properties
    fetchError.message = fetchError.message || 'Failed to fetch';
    throw fetchError;
  }

  const {
    json: { error, error_description, ...data },
    ok,
  } = response;

  if (!ok) {
    const errorMessage =
      error_description || `HTTP error. Unable to fetch ${url}`;

    if (error === 'mfa_required') {
      throw new MfaRequiredError(error, errorMessage, data.mfa_token);
    }

    throw new GenericError(error || 'request_error', errorMessage);
  }

  return data;
}
