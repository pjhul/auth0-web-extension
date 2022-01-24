export default class Lock {
    private waiters;
    private id;
    private acquiredIatSet;
    constructor();
    acquireLock(key: string, timeout?: number): Promise<boolean>;
    releaseLock(key: string): Promise<void>;
    private refreshLock;
    private lockCorrector;
    private waitForSomethingToChange;
    private addToWaiting;
    private removeFromWaiting;
    private notifyWaiters;
    private allKeys;
    private hasKey;
    private setItem;
    private getItem;
    private removeItem;
}
