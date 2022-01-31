interface ClientStorageOptions {
  daysUntilExpire: number;
}

export interface ClientStorage {
  get<T extends Object>(key: string): T | undefined;
  save(key: string, value: any, options?: ClientStorageOptions): void;
  remove(key: string): void;
}

export class InMemoryStorage implements ClientStorage {
  private storage: Record<string, any> = {};

  public get<T extends Object>(key: string) {
    const value = this.storage[key];

    if (typeof value === 'undefined') {
      return;
    }

    return <T>JSON.parse(value);
  }

  public save(key: string, value: any): void {
    this.storage[key] = JSON.stringify(value);
  }

  public remove(key: string) {
    delete this.storage[key];
  }
}
