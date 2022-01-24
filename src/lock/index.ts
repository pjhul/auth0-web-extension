import browser from "webextension-polyfill"

import getProcessLock from "./processLock"

import { createRandomString } from "../utils"

const LOCK_STORAGE_PREFIX = "auth0-web-extension-lock-key";

const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getLockId = (): string => {
  return Date.now().toString() + createRandomString(15);
}

export default class Lock {
  private waiters: Array<any> | undefined = undefined;
  private id: string
  private acquiredIatSet: Set<string> = new Set<string>()

  constructor() {
    this.id = getLockId();
    if(this.waiters === undefined) {
      this.waiters = []
    }
  }

  public async acquireLock(key: string, timeout: number = 5000) {
    let iat = Date.now() + createRandomString(4);
    const maxTime = Date.now() + timeout;
    const storageKey = `${LOCK_STORAGE_PREFIX}::${key}`;

    while(Date.now() < maxTime) {
      await delay(30);

      if(await this.hasKey(storageKey)) {
        await this.lockCorrector()
        await this.waitForSomethingToChange(maxTime)
      } else {
        const timeoutKey = `${this.id}::${key}::${iat}`;

        await this.setItem(storageKey, JSON.stringify({
          id: this.id,
          iat,
          timeoutKey,
          timeAcquired: Date.now(),
          timeRefreshed: Date.now(),
        }));

        await delay(30);

        let itemPostDelay = await this.getItem(storageKey);

        if(itemPostDelay !== null) {
          const item = JSON.parse(itemPostDelay);

          if(item.id === this.id && item.iat === iat) {
            this.acquiredIatSet.add(iat);
            this.refreshLock(key, iat)
            return true;
          }
        }
      }

      iat = Date.now() + createRandomString(4);
    }

    return false;
  }

  public async releaseLock(key: string): Promise<void> {
    const storageKey = `${LOCK_STORAGE_PREFIX}::${key}`;
    let lockObj = await this.getItem(storageKey);
    if (lockObj === null) {
      return;
    }

    const parsed = JSON.parse(lockObj)

    if(parsed.id === this.id) {
      await getProcessLock().lock(parsed.iat)

      this.acquiredIatSet.delete(parsed.iat)
      await this.removeItem(storageKey)

      getProcessLock().unlock(parsed.iat)

      this.notifyWaiters()
    }
  }

  private async refreshLock(key: string, iat: string) {
    setTimeout(async () => {
      await getProcessLock().lock(iat);

      if(!this.acquiredIatSet.has(iat)) {
        getProcessLock().unlock(iat)
        return
      }

      const item = await this.getItem(key)

      if(item !== null) {
        const parsed = JSON.parse(item)
        parsed.timeRefreshed = Date.now()
        await this.setItem(key, JSON.stringify(parsed))
        getProcessLock().unlock(iat)
      } else {
        getProcessLock().unlock(iat)
        return
      }
      this.refreshLock(key, iat)
    }, 1000)
  }

  private async lockCorrector() {
    const minTime = Date.now() - 5000;
    const keys = await this.allKeys()

    let notifyWaiters = false
    for await (let key of keys) {
      if(key.includes(LOCK_STORAGE_PREFIX)) {
        let lockObj = await this.getItem(key);
        if(lockObj !== null) {
          const parsed = JSON.parse(lockObj)
          if((parsed.timeRefreshed === undefined && parsed.timeAcquired < minTime) ||
            (parsed.timeRefreshed !== undefined && parsed.timeRefreshed < minTime)) {
            this.removeItem(key)
            notifyWaiters = true
          }
        }
      }
    }

    if(notifyWaiters) {
      this.notifyWaiters()
    }
  }


  private async waitForSomethingToChange(maxTime: number) {
    await new Promise<void>(resolve => {
      let resolveCalled = false
      let startedAt = Date.now()
      const minTime = 50
      let removedListeners = false

      const stopWaiting = () => {
        if(!removedListeners) {
          browser.storage.onChanged.removeListener(stopWaiting)
          this.removeFromWaiting(stopWaiting)
          clearTimeout(timeoutId)
          removedListeners = true
        }

        if(!resolveCalled) {
          resolveCalled = true
          let timeToWait = minTime - (Date.now() - startedAt)
          if(timeToWait > 0) {
            setTimeout(resolve, timeToWait)
          } else {
            resolve()
          }
        }
      }

      browser.storage.onChanged.addListener(stopWaiting)
      this.addToWaiting(stopWaiting)
      let timeoutId = setTimeout(stopWaiting, Math.max(0, maxTime - Date.now()))
    })
  }

  private addToWaiting(func: any) {
      this.removeFromWaiting(func);
      if (this.waiters === undefined) {
          return;
      }
      this.waiters.push(func);
  }

  private removeFromWaiting(func: any) {
      if (this.waiters === undefined) {
          return;
      }
      this.waiters = this.waiters.filter(i => i !== func);
  }


  private notifyWaiters() {
    if(this.waiters === undefined) {
      return
    }

    [...this.waiters].forEach(i => i())
  }

  private async allKeys(): Promise<string[]> {
    const items = await browser.storage.local.get(null)
    return Object.keys(items)
  }

  private async hasKey(key: string): Promise<boolean> {
    const item = await browser.storage.local.get(key);
    return Boolean(item?.[key]);
  }

  private async setItem(key: string, value: string): Promise<void> {
    return await browser.storage.local.set({ [key]: value })
  }

  private async getItem(key: string): Promise<string | null> {
    const item = await browser.storage.local.get(key);

    return item?.[key] || null;
  }

  private async removeItem(key: string): Promise<void> {
    return await browser.storage.local.remove(key)
  }
}
