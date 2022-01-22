import { FetchOptions } from './global';
export declare const createAbortController: () => AbortController;
export declare function fetchJSON<T>(url: string, options: FetchOptions, timeout?: number): Promise<T>;
