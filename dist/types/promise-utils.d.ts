export declare const delay: (ms: number) => Promise<void>;
export declare const singlePromise: <T>(cb: () => Promise<T>, key: string) => Promise<any>;
export declare const retryPromise: <T>(cb: () => Promise<T>, maxNumberOfRetries?: number) => Promise<T | null>;
