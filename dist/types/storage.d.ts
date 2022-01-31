interface ClientStorageOptions {
    daysUntilExpire: number;
}
export interface ClientStorage {
    get<T extends Object>(key: string): T | undefined;
    save(key: string, value: any, options?: ClientStorageOptions): void;
    remove(key: string): void;
}
export declare class InMemoryStorage implements ClientStorage {
    private storage;
    get<T extends Object>(key: string): T | undefined;
    save(key: string, value: any): void;
    remove(key: string): void;
}
export {};
