import { FetchOptions } from './global';
export declare const createAbortController: () => AbortController;
export declare const fetchWithTimeout: (fetchUrl: string, fetchOptions: FetchOptions, timeout?: number) => Promise<unknown>;
export declare function fetchJSON<T>(url: string, options: FetchOptions, timeout?: number): Promise<T>;
